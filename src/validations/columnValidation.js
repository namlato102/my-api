import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    // if want to move column to another board then need to provide boardId
    // boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
    // after data is validated, pass to controller
    next()
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    // if data is invalid, next to errorHandlingMiddleware in server.js to return error to client
    next(customError)
  }
}

const deleteColumnDetails = async (req, res, next) => {
  const correctCondition = Joi.object({
    // validate id from request params
    id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })

  try {
    await correctCondition.validateAsync(req.params)
    // after data is validated, pass to controller
    next()
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    // if data is invalid, next to errorHandlingMiddleware in server.js to return error to client
    next(customError)
  }
}

export const columnValidation = {
  createNew,
  update,
  deleteColumnDetails
}