/* eslint-disable no-useless-catch */
// tầng service xử lý logic, dữ liệu
// return a promise
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const createNew = async(reqbody) => {
  try {
    // xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqbody,
      slugTitle: slugify(reqbody.title)
    }

    /**
     * Gọi tới tầng Model dể xử lý lưu bản ghi newBoard vào trong Database
     * createdBoard.insertedId (insertOneResult.insertedId) is ready to access
     */
    const createdBoard = await boardModel.createNew(newBoard)

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

const getBoardDetailsFromModel = async (boardId) => {
  try {
    const board = await boardModel.getBoardDetailsFromDB(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }
    // https://www.javascripttutorial.net/javascript-primitive-vs-reference-values/
    // create a copy of board
    const resBoard = cloneDeep(board)
    // dua card ve dung column cua no
    resBoard.columns.forEach(column => {
    //   // convert objectId to string with .toString() from js
    //   column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
      // objectId.equal() is supported in mongoDB
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))

    })
    // xoa mang cards khoi board ban dau
    delete resBoard.cards

    return resBoard
  } catch (error) { throw (error) }
}

export const boardService = {
  createNew,
  getBoardDetailsFromModel
}