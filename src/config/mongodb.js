const MONGODB_URI = 'mongodb+srv://namlato102:Namlato102;@cluster0.0x8a0qk.mongodb.net/?retryWrites=true&w=majority'

const DATABASE_NAME = 'trello-namlato102'

import { MongoClient, ServerApiVersion } from 'mongodb'

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
