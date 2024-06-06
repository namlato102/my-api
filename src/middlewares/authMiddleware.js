import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'

// Middleware verify JWT token from client (FE)
const isAuthorized = async (req, res, next) => {
  // accessToken from request cookies in client side - withCredentials in authorizeAxios
  // https://expressjs.com/en/api.html#req.cookies
  const clientAccessToken = req.cookies.accessToken

  // If clientAccessToken not found, return error
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Access Token is required!'))
    return
  }

  try {
    // decode token using verifyToken method from JwtProvider
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    // console.log('accessTokenDecoded: ', accessTokenDecoded)
    // If token is valid, save decoded token to req.jwtDecoded for later use
    req.jwtDecoded = accessTokenDecoded
    // allow request to go to the next process
    next()
  } catch (error) {
    // console.log('authMiddleware: ', error)
    // If token is expired, return 410 error then FE will call refreshToken API
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Access Token is expired!'))
      return
    }
    // If accessToken is invalid, return 401 error then FE will call logout API
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Access Token is invalid!'))
  }
}

export const authMiddleware = {
  isAuthorized
}