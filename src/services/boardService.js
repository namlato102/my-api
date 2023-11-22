/* eslint-disable no-useless-catch */
// tầng service xử lý logic, dữ liệu
// return a promise
import { slugify } from '../utils/formatters'
import { boardModel } from '../models/boardModel'
import ApiError from '../utils/ApiError'
import { StatusCodes } from 'http-status-codes'


const createNew = async(reqbody) => {
  try {
    // xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqbody,
      slugTitle: slugify(reqbody.title)
    }

    /**
     * Gọi tới tầng Model dể xử lý lưu bản ghi newBoard vào trong Database
     */
    const createdBoard = await boardModel.createNew(newBoard)

    // Lấy bản ghi board sau khi gọi
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
    return board
  } catch (error) { throw (error) }
}

export const boardService = {
  createNew,
  getBoardDetailsFromModel
}