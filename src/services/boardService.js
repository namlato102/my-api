/* eslint-disable no-useless-catch */
// tầng service xử lý logic, dữ liệu
// return a promise
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants'

const createNew = async (userId, reqBody) => {
  try {
    // xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slugTitle: slugify(reqBody.title)
    }

    /**
     * Gọi tới tầng Model dể xử lý lưu bản ghi newBoard vào trong Database
     * createdBoard.insertedId (insertOneResult.insertedId) is ready to access
     */
    const createdBoard = await boardModel.createNew(userId, newBoard)

    // returns a single document (BOARD_COLLECTION_SCHEMA) from the "boards" collection with insertOneResult.insertedId
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    /**
     * Làm thêm các xử lý logic khác với các Collection khác
     * bắn email, notification cho admin khi board đc tạo mới
     */

    // service luôn phải có return trả về cho controller
    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getBoardDetailsFromModel = async (userId, boardId) => {
  try {
    const board = await boardModel.getBoardDetailsFromDB(userId, boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }
    // https://www.javascripttutorial.net/javascript-primitive-vs-reference-values/
    // create a copy of board
    const resBoard = cloneDeep(board)
    // đưa card về đúng column, vì trong model column và card cùng cấp
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })
    // xóa mảng cards khỏi board
    delete resBoard.cards

    return resBoard
  } catch (error) { throw (error) }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) { throw (error) }
}

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // update cardOrderIds of old column and new column when moving card to different column by delete card
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    // update cardOrderIds of new column by add card
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })

    // update columnId of dragged card
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })

    return { updateResult: 'Successfully' }
  } catch (error) { throw (error) }
}

const getBoards = async (userId, page, itemsPerPage, queryFilters) => {
  try {
    // Nếu không tồn tại page hoặc itemsPerPage từ phía FE thì BE sẽ cần phải luôn gán giá trị mặc định
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE

    const results = await boardModel.getBoards(
      userId,
      parseInt(page, 10),
      parseInt(itemsPerPage, 10),
      queryFilters
    )

    return results
  } catch (error) { throw error }
}

const deleteItem = async (boardId) => {
  try {
    const targetBoard = await boardModel.findOneById(boardId)
    if (!targetBoard) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    // Delete Board
    await boardModel.deleteOneById(boardId)

    // Delete Columns in Board
    await columnModel.deleteManyByBoardId(boardId)

    // Delete Cards in Board
    await cardModel.deleteManyByBoardId(boardId)

    return { deleteResult: 'Board and its content deleted successfully!' }
  } catch (error) { throw error }
}

export const boardService = {
  createNew,
  getBoardDetailsFromModel,
  update,
  moveCardToDifferentColumn,
  getBoards,
  deleteItem
}