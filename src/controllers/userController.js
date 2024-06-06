import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import ms from 'ms'

const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) { next(error) }
}

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)

    // handle return http only cookie for browser
    // console.log('login': result)
    /**
     * maxAge and ms: https://expressjs.com/en/api.html#res.cookie
     */
    res.cookie(
      'accessToken',
      result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('14 days')
      }
    )
    res.cookie(
      'refreshToken',
      result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('14 days')
      }
    )

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const userController = {
  createNew,
  verifyAccount,
  login
}