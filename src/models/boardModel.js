// https://www.mongodb.com/docs/manual/reference/method/ObjectId/
// https://stackoverflow.com/questions/57658864/how-to-validate-for-objectid
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'

// Define Collection (name & schema)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slugTitle: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),

  // Lưu ý các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// trả về một document từ bảng "boards" mongoDB với insertOneResult
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    /**
     * https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertOne/
     * Connect to the "mongoDB" database and access its "boards" collection
     * Insert the defined document (BOARD_COLLECTION_SCHEMA) into the "boards" collection
     * ID of the inserted document is added: .insertedId
     */
    const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
    return createdBoard
  } catch (error) {
    throw new Error(error)
  }
}

// trả về một full data document từ bảng "boards" từ mongoDB với _id phù hợp
const findOneById = async (id) => {
  try {
    /**
     * https://www.mongodb.com/docs/manual/reference/method/db.collection.findOne/#mongodb-method-db.collection.findOne
     * returns a single document (BOARD_COLLECTION_SCHEMA) from the "boards" collection with selectedId
     */
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * https://www.mongodb.com/docs/manual/reference/method/db.collection.aggregate/
 * https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/lookup/
 * query a board and retrieve all column and card from the board
 */
const getBoardDetailsFromDB = async (id) => {
  try {
    // const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
    //   _id: new ObjectId(id)
    // })
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: {
        _id: new ObjectId(id),
        _destroy: false
      } },
      { $lookup: {
        from: columnModel.COLUMN_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      } },
      { $lookup: {
        from: cardModel.CARD_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'cards'
      } }
    ]).toArray()

    return result[0] || null
  } catch (error) { throw new Error(error) }
}

// update columnId in columnOrderIds
// https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/
// https://www.mongodb.com/docs/manual/reference/operator/update/push/
const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      // search and filter with boardId
      // _id, boardId trong bang columns
      { _id: new ObjectId(column.boardId) },
      // update
      { $push: { columnOrderIds: new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )
    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getBoardDetailsFromDB,
  pushColumnOrderIds
}