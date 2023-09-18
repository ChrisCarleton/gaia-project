const CollectionName = 'Games';
const ThreeDaysInSeconds = 60 * 60 * 24 * 3;

module.exports = {
  async up(db) {
    const games = await db.createCollection(CollectionName);
    await games.createIndex(
      { updatedOn: -1 },
      {
        name: 'games_updatedOn_expires',
        expireAfterSeconds: ThreeDaysInSeconds,
      },
    );
  },

  async down(db) {
    await db.dropCollection(CollectionName);
  },
};
