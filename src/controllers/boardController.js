// tầng điều hướng
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id

    // pass request to service to create new Board and return createdBoard to controller
    const createdBoard = await boardService.createNew(userId, req.body)

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
    const userId = req.jwtDecoded._id
    const board = await boardService.getBoardDetailsFromModel(userId, boardId)

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

const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    // page và itemsPerPage được truyền vào trong query url từ phía FE nên BE sẽ lấy thông qua req.query
    const { page, itemsPerPage, q } = req.query
    const queryFilters = q

    const results = await boardService.getBoards(userId, page, itemsPerPage, queryFilters)

    res.status(StatusCodes.OK).json(results)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew,
  getBoardDetailsFromService,
  update,
  moveCardToDifferentColumn,
  getBoards
}