// represent route in v1
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from '~/routes/v1/boardRoute'
import { cardRoutes } from './cardRoute'
import { columnRoutes } from './columnRoute'
import { userRoute } from '~/routes/v1/userRoute'
import { invitationRoute } from '~/routes/v1/invitationRoute'

// create modular, mountable route handlers
const Router = express.Router()

/** Check APIs v1/status */
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.', code: StatusCodes.OK })
})

/** Board APIs */
Router.use('/boards', boardRoutes)

/** Column APIs */
Router.use('/columns', columnRoutes)

/** Cards APIs */
Router.use('/cards', cardRoutes)

/** User APIs */
Router.use('/users', userRoute)

/** Invitation APIs */
Router.use('/invitations', invitationRoute)

export const APIs_V1 = Router