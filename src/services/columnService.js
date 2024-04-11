
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
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

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)
    return updatedColumn
  } catch (error) { throw (error) }
}

const deleteColumnDetails = async (columnId) => {
  try {
    // delete column from columns collection
    await columnModel.deleteOneById(columnId)
    // delete cards from column
    await cardModel.deleteManyByColumnId(columnId)
    return { deleteResult: 'Column deleted successfully.' }
  } catch (error) { throw (error) }
}

export const columnService = {
  createNew,
  update,
  deleteColumnDetails
}