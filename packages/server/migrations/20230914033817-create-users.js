const CollectionName = 'Users';

module.exports = {
  async up(db) {
    const users = await db.createCollection(CollectionName);
    await users.createIndex(
      { emailLowered: 1 },
      {
        name: 'users_email',
        unique: true,
      },
    );
    await users.createIndex(
      { googleId: 1 },
      {
        name: 'users_googleId',
        unique: true,
        sparse: true,
      },
    );
  },

  async down(db) {
    await db.dropCollection(CollectionName);
  },
};
