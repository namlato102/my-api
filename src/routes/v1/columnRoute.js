import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { columnValidation } from '../../validations/columnValidation'
import { columnController } from '../../controllers/columnController'

const Router = express.Router()

// create chainable route handlers
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list columns.', code: StatusCodes.OK })
  })
  .post(columnValidation.createNew, columnController.createNew)


export const columnRoutes = Router