import { FactionType } from '@gaia-project/api';
import { z } from 'zod';

export const GameSchema = z.object({
  _id: z.string(),
  createdOn: z.date(),
  lastUpdated: z.date().optional(),
  owner: z.string(),
  players: z
    .object({
      playerId: z.string(),
      faction: z.nativeEnum(FactionType).nullable().optional(),
    })
    .array()
    .max(4),
});
export type GameDocument = z.infer<typeof GameSchema>;
