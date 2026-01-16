import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { authMiddleware } from '~/middlewares/authMiddleware'

// create modular, mountable route handlers
const Router = express.Router()

// get list boards and create new board with validation middleware and controller
Router.route('/')
  .get(authMiddleware.isAuthorized, boardController.getBoards)
  .post(authMiddleware.isAuthorized, boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  // call id from db start from controller, no need to go through validation
  .get(authMiddleware.isAuthorized, boardController.getBoardDetailsFromService)
  .put(authMiddleware.isAuthorized, boardValidation.update, boardController.update)
  // delete
  .delete(boardController.deleteItem)

Router.route('/supports/moving_card')
  .put(authMiddleware.isAuthorized, boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

export const boardRoutes = Router