import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

const MONGODB_URI = env.MONGODB_URI
const DATABASE_NAME = env.DATABASE_NAME


// khoi tao mot doi tuong trelloDatabaseIbstance ban dau la null (vi chua connect)
let trelloDatabaseInstance = null

// khoi tao mot doi tuong Client Instance de connect toi MongoDB
const mongoClientInstance = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// ket noi toi Database
export const CONNECT_DB = async () => {
  // goi ket noi toi MongoDB Atlas voi URI da khai bao trong than cua mongoClientInstance
  await mongoClientInstance.connect()

  // ket noi thanh cong thi lay ra Database theo ten va gan nguoc no lai vao bien trelloDatabaseInstance o tren
  trelloDatabaseInstance = mongoClientInstance.db(DATABASE_NAME)
}

export const CLOSE_DB = async () => {

  await mongoClientInstance.close()
}

// export ra trello instance sau khi da connect thanh cong mongoDB
// chi sd khi da ket noi thanh cong toi DB
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('must connect to Database first')
  return trelloDatabaseInstance
}
