import { StatusCodes } from 'http-status-codes'


const createNew = async (req, res, next) => {
  try {
    // console.log('req.body: ', req.body)

    // // test error
    // throw new ApiError(StatusCodes.BAD_GATEWAY, 'Wtf Error!')

    // dieu huong du lieu sang tang service
    // next()

    // co ket qua thi tra ve client (data)
    res.status(StatusCodes.CREATED).json({ message: 'POST from Controller: API create new boards.', code: StatusCodes.CREATED })
  } catch (error) {
    // redirect to error handle middleware in server.js
    next(error)
  }
}

export const boardController = {
  createNew
}