import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

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
    description: Joi.string().required().min(3).max(256).trim().strict()
  })

  try {
    // console.log('req.body: ', req.body)
    // validate data from BE
    // set joi abortearly: flase to return every valid error from correctcondition
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // sau khi validate data thi request di tiep sang controller
    next()
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message,
      code: StatusCodes.UNPROCESSABLE_ENTITY
    })
  }

}

export const boardValidation = {
  createNew
}