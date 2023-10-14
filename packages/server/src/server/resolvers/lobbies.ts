import {
  LobbyDto,
  MutationResolvers,
  QueryResolvers,
  SubscriptionResolvers,
} from '@gaia-project/api';
import { Request } from 'express';

import { PubSubEngine } from '../pubsub';
import { requireAuth } from './utils';

export async function createLobby(ctx: Request): Promise<LobbyDto> {
  const user = requireAuth(ctx);
  const lobby = await ctx.lobbies.createLobby(user);
  return lobby.toJSON();
}

export async function getLobby(
  ctx: Request,
  lobbyId: string,
): Promise<LobbyDto | null> {
  requireAuth(ctx);
  const lobby = await ctx.lobbies.getLobby(lobbyId);
  return lobby ? lobby.toJSON() : null;
}

export const LobbyQueries: QueryResolvers = {
  lobbiesGetLobby: (_parent, { id }, ctx) => getLobby(ctx, id),
} as const;

export const LobbyMutations: MutationResolvers = {
  lobbiesCreateLobby: (_parent, _args, ctx) => createLobby(ctx),
} as const;

export function getLobbySubscriptions(
  pubSubEngine: PubSubEngine,
): SubscriptionResolvers {
  return {
    lobbiesJoin: {
      subscribe: () => pubSubEngine.asyncIterator<LobbyDto>(),
      resolve: async (): Promise<LobbyDto> => {
        throw new Error('Blah');
      },
    },
  };
}
