/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
// env variables - object destructuring
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()

  // cors handle
  app.use(cors(corsOptions))

  const hostname = env.LOCAL_DEV_APP_HOST
  const port = env.LOCAL_DEV_APP_PORT
  const author = env.AUTHOR

  // enable req.body json data avoid undefined
  app.use(express.json())

  // use APIs V1
  app.use('/v1', APIs_V1)

  // error handle middleware
  app.use(errorHandlingMiddleware)

  if (env.BUILD_MODE === 'prod') {
    // production mode support render
    app.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`3. Production: Hello ${author}, I am running at Port: ${ process.env.PORT }/`)
    })
  } else {
    // dev mode
    app.listen(port, hostname, () => {
      // eslint-disable-next-line no-console
      console.log(`3. Local DEV: Hello ${author}, I am running at http://${ hostname }:${ port }/`)
    })
  }

  // clean up before exit
  exitHook(() => {
    console.log('4. Server is shutting down...')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB Cloud Atlas')
  })
}

// Immediately invoked / anonymous async functions (IIFE)
(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    // exit server
    process.exit(0)
  }
})()

// console.log('1. Connecting to MongoDB Cloud Atlas...')
// // chi khi ket noi DB thanh cong thi moi start server backend len
// CONNECT_DB()
//   .then(() => console.log('2. Connected to MongoDB Cloud Atlas!'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     // exit server
//     process.exit(0)
//   })