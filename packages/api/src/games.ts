import { z } from 'zod';

export enum FactionType {
  Ambas = 'ambas',
  BalTaks = 'balTaks',
  Bescods = 'bescods',
  Firaks = 'firaks',
  Geodens = 'geodens',
  Gleens = 'gleens',
  HadschHallas = 'hadschHallas',
  Itars = 'itars',
  Ivits = 'ivits',
  Nevlas = 'nevlas',
  Lantids = 'lantids',
  Taklons = 'taklons',
  Terrans = 'terrans',
  Xenos = 'xenos',
}

export const PlayerDTOSchema = z.object({
  id: z.string(),
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
