import express from 'express'
import { StatusCodes } from 'http-status-codes'

// create modular, mountable route handlers
const Router = express.Router()

// create chainable route handlers
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards.', code: StatusCodes.OK })
  })
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({ message: 'POST: API create new boards.', code: StatusCodes.CREATED })
  })

export const boardRoutes = Router