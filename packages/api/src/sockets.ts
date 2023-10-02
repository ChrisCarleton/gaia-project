import { FactionType } from '@gaia-project/engine';
import { z } from 'zod';

export enum MessageType {
  Error = 'error',
  StateChange = 'state',
  PlayerCommand = 'command',
}

export enum PlayerCommand {
  SelectFaction = 'selectFaction',
}

export enum StateChangeCode {
  playerConnect = 'connection',
  playerDisconnect = 'disconnect',
}

export const MessageHeaderSchema = z.object({
  fromServer: z.string().uuid(),
  lobby: z.string().uuid().optional(),
  user: z.string().uuid().optional(),
});
export type MessageHeader = z.infer<typeof MessageHeaderSchema>;

export const ErrorMessageSchema = z.object({
  type: z.literal(MessageType.Error),
  code: z.string(),
  message: z.string(),
});
export type ErrorMessage = z.infer<typeof ErrorMessageSchema>;

const PlayerConnectStateUpdateMessageSchema = z.object({
  code: z.literal(StateChangeCode.playerConnect),
  connection: z.object({
    lobby: z.string().uuid(),
    user: z.string().uuid(),
  }),
});
export type PlayerConnectStateUpdateMessage = z.infer<
  typeof PlayerConnectStateUpdateMessageSchema
>;

export const StateUpdateMessageSchema = z
  .object({
    type: z.literal(MessageType.StateChange),
  })
  .merge(PlayerConnectStateUpdateMessageSchema);
export type StateUpdateMessage = PlayerConnectStateUpdateMessage;

export const SelectFactionPlayerCommandSchema = z.object({
  command: z.literal(PlayerCommand.SelectFaction),
  faction: z.nativeEnum(FactionType).nullable(),
});
export type SelectFactionPlayerCommand = z.infer<
  typeof SelectFactionPlayerCommandSchema
>;

export const PlayerCommandMessageSchema = z
  .object({
    type: z.literal(MessageType.PlayerCommand),
  })
  .merge(SelectFactionPlayerCommandSchema);
export type PlayerCommandMessage = z.infer<typeof PlayerCommandMessageSchema>;

export const MessagePayloadSchema = z.discriminatedUnion('type', [
  PlayerCommandMessageSchema,
  ErrorMessageSchema,
  StateUpdateMessageSchema,
]);
export type MessagePayload = z.infer<typeof MessagePayloadSchema>;

export const MessageSchema = z.intersection(
  MessageHeaderSchema,
  MessagePayloadSchema,
);
export type Message = z.infer<typeof MessageSchema>;
