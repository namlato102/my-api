import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { cardController } from '~/controllers/cardController'
import { cardValidation } from '~/validations/cardValidation'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// create chainable route handlers
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list cards.', code: StatusCodes.OK })
  })
  .post(authMiddleware.isAuthorized, cardValidation.createNew, cardController.createNew)

Router.route('/:id')
  .put(authMiddleware.isAuthorized, cardValidation.update, cardController.update)

export const cardRoutes = Router