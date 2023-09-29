import { FactionType } from '@gaia-project/engine';
import { z } from 'zod';

export const PlayerDTOSchema = z.object({
  id: z.string(),
  memberSince: z.coerce.date(),
  displayName: z.string(),
  avatar: z.string().optional(),
  faction: z.nativeEnum(FactionType).nullable().optional(),
});
export type PlayerDTO = z.infer<typeof PlayerDTOSchema>;

export const LobbyDTOSchema = z.object({
  id: z.string(),
  createdOn: z.coerce.date(),
  ownerId: z.string(),
  players: PlayerDTOSchema.array(),
});
export type LobbyDTO = z.infer<typeof LobbyDTOSchema>;
