// tầng điều hướng
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    // test error
    // throw new ApiError(StatusCodes.BAD_GATEWAY, 'Wtf Error!')

    // pass request to service to create new Board and return createdBoard to controller
    const createdBoard = await boardService.createNew(req.body)

    // return createdBoard to client
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    // if error, pass to errorHandlingMiddleware in server.js to return error to client
    next(error)
  }
}

const getBoardDetailsFromService = async (req, res, next) => {
  try {
    // id from route
    const boardId = req.params.id
    const board = await boardService.getBoardDetailsFromModel(boardId)

    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.update(boardId, req.body)

    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) { next(error) }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew,
  getBoardDetailsFromService,
  update,
  moveCardToDifferentColumn
}