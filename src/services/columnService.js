
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'


const createNew = async(reqbody) => {
  try {
    const newColumn = {
      ...reqbody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    // update columnOrderIds in boards collection when new column created
    if (getNewColumn) {
      //  create empty array cards when create new column for client
      getNewColumn.cards = []
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) { throw error }
}

export const columnService = {
  createNew
}