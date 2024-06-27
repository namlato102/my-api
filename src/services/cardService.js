
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'


const createNew = async(reqbody) => {
  try {
    const newCard = {
      ...reqbody
    }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    // update cardOrderIds in columns collection when new card created
    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) { throw error }
}

const update = async (cardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedCard = await cardModel.update(cardId, updateData)

    return updatedCard
  } catch (error) { throw error }
}

export const cardService = {
  createNew,
  update
}