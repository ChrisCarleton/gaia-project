import 'dotenv/config';
import { mongoMigrateCli } from 'mongo-migrate-ts';

mongoMigrateCli({
  uri:
    process.env.PG_MONGODB_URI ??
    'mongodb://localhost:27017/gaia-project-local',
  migrationsDir: __dirname,
  migrationsCollection: 'MigrationsCollection',
});
