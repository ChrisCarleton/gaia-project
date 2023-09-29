import { FactionType } from '@gaia-project/engine';
import { z } from 'zod';

export const GameSchema = z.object({
  _id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
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
