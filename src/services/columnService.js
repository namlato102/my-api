
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'


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
    // find wanted column by columnId from columns collection
    const targetColumn = await columnModel.findOneById(columnId)
    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }
    // delete column from columns collection
    await columnModel.deleteOneById(columnId)
    // delete cards from column
    await cardModel.deleteManyByColumnId(columnId)
    // delete columnId from columnOrderIds array in boards collection
    await boardModel.pullColumnOrderIds(targetColumn)

    return { deleteResult: 'Column deleted successfully.' }
  } catch (error) { throw (error) }
}

export const columnService = {
  createNew,
  update,
  deleteColumnDetails
}