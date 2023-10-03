import fs from 'fs/promises';
import path from 'path';

export async function loadTypeDefs(): Promise<string> {
  const typeDefs = await fs.readFile(
    path.resolve(__dirname, './schema.graphql'),
    { encoding: 'utf-8' },
  );
  return typeDefs;
}
