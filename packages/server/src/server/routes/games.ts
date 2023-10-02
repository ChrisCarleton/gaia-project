import { JoinLobbyResponse } from '@gaia-project/api';
import { Express, NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import config from '../../config';
import { ForbiddenError, NotFoundError } from '../../errors';
import { requireAuth } from './auth';

export async function createLobby(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new Error('User not logged in.');
  }

  const lobby = await req.lobbies.createLobby(req.user);
  res.json(lobby);
}

export async function deleteLobby(req: Request, res: Response): Promise<void> {
  const success = await req.currentLobby?.delete();
  res.json({ success: success ?? false });
}

export async function getLobby(req: Request, res: Response): Promise<void> {
  res.json(req.currentLobby);
}

export async function joinLobby(req: Request, res: Response): Promise<void> {
  if (!req.currentLobby || !req.user) {
    throw new Error('No lobby loaded or no user logged in.');
  }

  // TODO: Implement this!!
  await req.currentLobby.join(req.user);

  const now = Date.now();
  const payload: JwtPayload = {
    exp: 120 + now,
    sub: JSON.stringify({
      lobby: req.currentLobby.id,
      user: req.user.id,
    }),
  };
  const token = await new Promise<string>((resolve, reject) => {
    jwt.sign(payload, config.sessionSecret, (error, token) => {
      if (error) reject(error);
      else resolve(token!);
    });
  });

  const response: JoinLobbyResponse = {
    token,
    webSocketUri: '', // TODO: Generate this.
  };
  res.json(response);
}

export async function loadLobby(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const { gameId } = req.params;
  const lobby = await req.lobbies.getLobby(gameId);

  if (!lobby) throw new NotFoundError(`Lobby with ID "${gameId}" not found.`);

  // Make sure the user information is hydrated before returning.
  await Promise.all(lobby.players.map((player) => player.user()));

  req.currentLobby = lobby;
  next();
}

export async function requireOwnershipOfLobby(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.user || !req.currentLobby) {
    throw new Error('User was not signed in or current lobby was not loaded');
  }

  const lobbyOwner = await req.currentLobby.owner();
  if (lobbyOwner.id !== req.user.id) {
    throw new ForbiddenError(
      'Only the owner of the lobby may perform this operation.',
    );
  }

  next();
}

export function configureGamesRoutes(app: Express) {
  app.post('/api/lobby', requireAuth, createLobby);
  app
    .route('/api/lobby/:gameId')
    .get(requireAuth, loadLobby, getLobby)
    .delete(requireAuth, loadLobby, requireOwnershipOfLobby, deleteLobby);

  app.post('/api/lobby/:gameId/join', requireAuth, loadLobby, joinLobby);
}
