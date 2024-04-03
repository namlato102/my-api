import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'

// read https://joi.dev/api/?v=17.9.1
const createNew = async (req, res, next) => {

  // Joi json object - using custom error msg
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required :(',
      'string.empty': 'Title is not allow to be empty :(',
      'string.min': 'Title min 3 chars :(',
      'string.max': 'Title max 50 chars :(',
      'string.trim': 'Title must not have leading or trailing whitespace :('
    }),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
  })

  try {
    // validate uploaded data from FE with correctCondition
    // set joi abortearly: false to return all invalid error from correctcondition
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // after data is validated, pass to controller
    next()
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    // if data is invalid, next to errorHandlingMiddleware in server.js to return error to client
    next(customError)
  }
}

export const boardValidation = {
  createNew
}