import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  try {
    // console.log('req.body: ', req.body)

    // dieu huong du lieu sang tang service
    // next()
    // co ket qua thi tra ve client (data)
    res.status(StatusCodes.CREATED).json({ message: 'POST from Controller: API create new boards.', code: StatusCodes.CREATED })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: error.message,
      code: StatusCodes.INTERNAL_SERVER_ERROR
    })
  }
}

export const boardController = {
  createNew
}