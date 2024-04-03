// https://nodejs.org/api/errors.html
// https://expressjs.com/en/guide/error-handling.html

/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'

// Catch all errors from all middlewares and controllers in the app
export const errorHandlingMiddleware = (err, req, res, next) => {

  // default error status code is 500 if not set
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  // custom message, stack trace, status code responseError
  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode], // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
    stack: err.stack
  }

  // return stack trace only in development mode
  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  // Đoạn này có thể mở rộng nhiều về sau như ghi Error Log vào file, bắn thông báo lỗi vào group Slack,
  // Telegram, Email...vv Hoặc có thể viết riêng Code ra một file Middleware khác tùy dự án.
  // ...
  // console.error(responseError)

  // return error to client
  res.status(responseError.statusCode).json(responseError)
}