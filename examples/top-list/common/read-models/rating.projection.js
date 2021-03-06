export default {
  Init: async store => {
    await store.defineTable('Rating', {
      indexes: { id: 'string', rating: 'number' },
      fields: ['name', 'votes']
    })
  },

  ItemAppended: async (store, { payload: { id, name } }) => {
    await store.insert('Rating', { id, name, rating: 0, votes: {} })
  },

  RatingIncreased: async (store, { payload: { id, userId } }) => {
    if ((await store.count('Rating', { id, [`votes.${userId}`]: true })) > 0) {
      return
    }
    await store.update(
      'Rating',
      { id },
      {
        $inc: { rating: 1 },
        $set: { [`votes.${userId}`]: true }
      }
    )
  },

  RatingDecreased: async (store, { payload: { id, userId } }) => {
    if ((await store.count('Rating', { id, [`votes.${userId}`]: true })) < 1) {
      return
    }
    await store.update(
      'Rating',
      { id },
      {
        $inc: { rating: -1 },
        $unset: { [`votes.${userId}`]: true }
      }
    )
  }
}
