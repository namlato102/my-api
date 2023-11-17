import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'

// create modular, mountable route handlers
const Router = express.Router()

// create chainable route handlers
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards.', code: StatusCodes.OK })
  })
  .post(boardValidation.createNew)

export const boardRoutes = Router