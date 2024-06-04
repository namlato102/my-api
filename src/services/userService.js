import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'

const createNew = async (reqBody) => {
  try {
    // check if email existed in db
    const existedUser = await userModel.findOneByEmail(reqBody.email)
    if (existedUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
    }

    // create new user to save in db
    // nameFromEmail: ví dụ nếu email là example@gmail.com thì sẽ lấy được "example"
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }

    // save user info to db
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // send email to user to verify their account
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = 'MyTrello: Please verify your email before using our services!'
    const customHtmlContent = `
      <h3>Here is your verification link:</h3>
      <h3>${verificationLink}</h3>
      <h3>Sincerely,<br/> - MyTrello Team - </h3>
    `
    // use BrevoProvider to send email
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, customHtmlContent)

    // return data to controller
    return pickUser(getNewUser)
  } catch (error) { throw error }
}

const verifyAccount = async (reqBody) => {
  try {
    // check user account is existed or not
    const existedUser = await userModel.findOneByEmail(reqBody.email)
    if (!existedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    }

    // check user account is active or not
    if (existedUser.isActive) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Account is already active!')
    }

    // check user token is correct or not. check token from request body from fe payload and verifyToken from database
    if (reqBody.token !== existedUser.verifyToken) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid!')
    }

    // update user information to active account, remove verifyToken
    const updateData = {
      isActive: true,
      verifyToken: null
    }

    const updatedUser = await userModel.update(existedUser._id, updateData)
    // return value for controller
    return pickUser(updatedUser)
  } catch (error) { throw error }
}

export const userService = {
  createNew,
  verifyAccount
}
