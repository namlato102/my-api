import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

// create modular, mountable route handlers
const Router = express.Router()

// get list boards and create new board with validation middleware and controller
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards.', code: StatusCodes.OK })
  })
  // declare validation middleware and then next to controller if validation pass
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  // goi id tu db bat dau tu controller, ko can qua validation
  .get(boardController.getBoardDetailsFromService)
  // update
  .put(boardValidation.update, boardController.update)

Router.route('/supports/moving_card')
  .put(boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

export const boardRoutes = Router