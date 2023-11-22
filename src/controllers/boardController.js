// tầng điều hướng
import { StatusCodes } from 'http-status-codes'
import { boardService } from '../services/boardService'

const createNew = async (req, res, next) => {
  try {
    // console.log('req.body: ', req.body)

    // // test error
    // throw new ApiError(StatusCodes.BAD_GATEWAY, 'Wtf Error!')

    // điều hướng dữ liệu sang tầng service
    // service se access vao model de create new Board roi tra ve cho controller createdboard
    const createdBoard = await boardService.createNew(req.body)

    // có kết quả thì trả về client (data)
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    // nếu lỗi thì điều hướng tới tầng errorHandlingMiddleware
    next(error)
  }
}

const getBoardDetailsFromService= async (req, res, next) => {
  try {
    // id from route
    const boardId = req.params.id
    const board = await boardService.getBoardDetailsFromModel(boardId)

    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew,
  getBoardDetailsFromService
}