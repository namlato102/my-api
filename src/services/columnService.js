
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'


const createNew = async(reqbody) => {
  try {
    const newColumn = {
      ...reqbody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
    //  xu ly cau truc data trc khi tra du lieu ve
      getNewColumn.cards = []

      // update columnOrderIds in boards collection
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) { throw error }
}

export const columnService = {
  createNew
}