import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { cardController } from '../../controllers/cardController'
import { cardValidation } from '../../validations/cardValidation'

const Router = express.Router()

// create chainable route handlers
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list cards.', code: StatusCodes.OK })
  })
  .post(cardValidation.createNew, cardController.createNew)

export const cardRoutes = Router