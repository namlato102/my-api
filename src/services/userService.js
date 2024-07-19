import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

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

const login = async (reqBody) => {
  try {
    // Query user trong Database
    const existedUser = await userModel.findOneByEmail(reqBody.email)

    // check user account existence and activation
    if (!existedUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existedUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    // check password is correct or not
    const isCorrectPassword = bcryptjs.compareSync(reqBody.password, existedUser.password)
    if (!isCorrectPassword) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your email or password is incorrect!')
    }

    /**
     * If everything is ok, start creating Tokens to return to FE
     * https://www.npmjs.com/package/jsonwebtoken
     */
    // create userInfo object to attach in token with _id and email of user
    const userInfo = {
      _id: existedUser._id,
      email: existedUser.email
    }
    // create accessToken and refreshToken for user then return to FE
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )
    const refreshToken = await JwtProvider.generateToken(
      { email: existedUser.email },
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )

    // return user info with accessToken and refreshToken for controller
    return {
      ...pickUser(existedUser),
      accessToken,
      refreshToken
    }
  } catch (error) { throw error }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    // Decode clientRefreshToken in order to check if it is valid or not
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    // then create userInfo object to attach in token with _id and email of user from refreshTokenDecoded => less query to DB
    const userInfo = { _id: refreshTokenDecoded._id, email: refreshTokenDecoded.email }

    // then create new accessToken for user
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    // return accessToken for controller
    return { accessToken }
  } catch (error) { throw error }
}

const update = async (userId, reqBody, userAvatarFile) => {
  try {
    // Query User và kiểm tra cho chắc chắn
    const existedUser = await userModel.findOneById(userId)
    if (!existedUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existedUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    // Khởi tạo ra biến lưu trữ kết quả cập thông tin user
    let updatedUser = {}

    // Trường hợp change password
    if (reqBody.current_password && reqBody.new_password) {
      // Kiểm tra xem cái current_password có đúng hay không
      if (!bcryptjs.compareSync(reqBody.current_password, existedUser.password)) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your current password is incorrect!')
      }

      // Nếu như current_password đúng thì sẽ hash một cái mật khẩu mới và lưu lại vào DB
      updatedUser = await userModel.update(existedUser._id, {
        password: bcryptjs.hashSync(reqBody.new_password, 8)
      })
    } else if (userAvatarFile) {
      // Trường hợp upload file lên Cloud Storage (Cloudinary)
      const uploadResult = await CloudinaryProvider.streamUpload(userAvatarFile.buffer, 'users')
      // console.log('uploadResult: ', uploadResult)

      // Lưu lại url (secure_url) của file ảnh vào trong Database
      updatedUser = await userModel.update(existedUser._id, {
        avatar: uploadResult.secure_url
      })
    } else {
      // Trường hợp cập nhật các thông tin chung, ví dụ như displayName...vv
      updatedUser = await userModel.update(existedUser._id, reqBody)
    }

    return pickUser(updatedUser)
  } catch (error) { throw error }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  update
}
