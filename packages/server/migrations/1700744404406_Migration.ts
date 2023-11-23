import { MigrationInterface } from 'mongo-migrate-ts';
import { Db } from 'mongodb';

const UsersCollection = 'Users';
const GamesCollection = 'Games';

export class Migration1700744404406 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    const users = await db.createCollection(UsersCollection);

    await users.createIndex(
      { emailLowered: 1 },
      { name: 'UX_Users_emailLowered', unique: true },
    );
    await users.createIndex(
      { googleId: 1 },
      {
        name: 'UX_Users_googleId',
        unique: true,
        sparse: true,
      },
    );

    await db.createCollection(GamesCollection);
  }

  public async down(db: Db): Promise<void> {
    await Promise.all([
      db.dropCollection(UsersCollection),
      db.dropCollection(GamesCollection),
    ]);
  }
}
