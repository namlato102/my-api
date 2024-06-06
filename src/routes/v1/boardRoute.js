import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { authMiddleware } from '~/middlewares/authMiddleware'

// create modular, mountable route handlers
const Router = express.Router()

// get list boards and create new board with validation middleware and controller
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards.', code: StatusCodes.OK })
  })
  // declare validation middleware and then next to controller if validation pass
  .post(authMiddleware.isAuthorized, boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  // goi id tu db bat dau tu controller, ko can qua validation
  .get(authMiddleware.isAuthorized, boardController.getBoardDetailsFromService)
  // update
  .put(authMiddleware.isAuthorized, boardValidation.update, boardController.update)

Router.route('/supports/moving_card')
  .put(authMiddleware.isAuthorized, boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

export const boardRoutes = Router