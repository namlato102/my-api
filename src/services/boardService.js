/* eslint-disable no-useless-catch */
// tầng service xử lý logic, dữ liệu
// return a promise
import { slugify } from '../utils/formatters'


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

    /**
     * Làm thêm các xử lý logic khác với các Collection khác
     * bắn email, notification cho admin khi board đc tạo mới
     */

    // service luôn phải có return trả về cho controller
    return newBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew
}