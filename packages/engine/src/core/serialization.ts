import { z } from 'zod';

import { FactionType } from '../factions';
import { GameState, PlanetType, StructureType } from '../interfaces';
import { BuildFirstMinesPass } from '../states/build-first-mines-state';

const ResourceSchema = z.number().int().min(0);
const ResearchProgressSchema = z.number().int().min(0).max(5);

const BuildFirstMinesStateSchema = z.object({
  type: z.literal(GameState.BuildFirstMines),
  pass: z.nativeEnum(BuildFirstMinesPass),
  player: z.number().int(),
});

const ChooseFirstRoundBoostersStateSchema = z.object({
  type: z.literal(GameState.ChooseFirstRoundBoosters),
  player: z.number().int(),
});

// No variablity... just the state type.
const GameEndedStateSchema = z.object({
  type: z.literal(GameState.GameEnded),
});
const GameNotStartedStateSchema = z.object({
  type: z.literal(GameState.GameNotStarted),
});
const IncomePhaseStateSchema = z.object({
  type: z.literal(GameState.IncomePhase),
});

const StateSchema = z.discriminatedUnion('type', [
  BuildFirstMinesStateSchema,
  ChooseFirstRoundBoostersStateSchema,
  GameEndedStateSchema,
  GameNotStartedStateSchema,
  IncomePhaseStateSchema,
]);
export type SerializedState = z.infer<typeof StateSchema>;

const MapHexSchema = z.object({
  location: z.object({
    q: z.number().int(),
    r: z.number().int(),
  }),
  planet: z
    .object({
      type: z.nativeEnum(PlanetType),
      player: z.number().int().min(0).max(3).optional(),
      structure: z.nativeEnum(StructureType).optional(),
      hasLantidMine: z.boolean().optional(),
    })
    .optional(),
  hasIvitsStation: z.boolean().optional(),
});

const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  faction: z.nativeEnum(FactionType),

  powerCycle: z.object({
    gaia: ResourceSchema,
    l1: ResourceSchema,
    l2: ResourceSchema,
    l3: ResourceSchema,
  }),
  resources: z.object({
    credits: ResourceSchema,
    knowledge: ResourceSchema,
    ore: ResourceSchema,
    qic: ResourceSchema,
  }),
  research: z.object({
    terraforming: ResearchProgressSchema,
    navigation: ResearchProgressSchema,
    ai: ResearchProgressSchema,
    gaia: ResearchProgressSchema,
    economics: ResearchProgressSchema,
    science: ResearchProgressSchema,
  }),
  vp: z.number().int(),
});
export type SerializedPlayer = z.infer<typeof PlayerSchema>;

export const GameContextSchema = z.object({
  currentRound: z.number().int().min(0).max(6),
  currentPlayer: z.number().int().min(0).max(3),
  currentState: StateSchema,
  players: PlayerSchema.array().min(1).max(4),
  // .refine((players) => {
  //   // TODO: Ensure valid/unique IDs.
  //   // TODO: Validate for faction conflicts.
  // }),
  map: MapHexSchema.array(),
});
export type SerializedGameContext = z.infer<typeof GameContextSchema>;
