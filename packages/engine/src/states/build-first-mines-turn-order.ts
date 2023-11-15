import { FactionType, Player } from '../interfaces';

// TODO: Remove Partial when done.
type TurnOrderStrategies = Record<
  BuildFirstMinesPass,
  (
    players: Readonly<Player[]>,
    currentIndex: number,
  ) => BuildFirstMinesOptions | null
>;

export enum BuildFirstMinesPass {
  First,
  Second,
  Xenos, // Xenos get to build a third mine after everyone else has built two.
  Ivits, // Ivits do not build mines. Instead, they wait until everyone else has gone and then build their planetary institute.
}

export type BuildFirstMinesOptions = {
  playerIndex: number;
  pass: BuildFirstMinesPass;
};

export class BuildFirstMinesTurnOrder {
  private static strategies: TurnOrderStrategies = {
    [BuildFirstMinesPass.First]: (players, currentIndex) => {
      let nextIndex = currentIndex + 1;

      if (players[nextIndex]?.faction.factionType === FactionType.Ivits) {
        nextIndex++;
      }

      if (nextIndex >= players.length) {
        nextIndex = players.length - 1;

        if (players[nextIndex].faction.factionType === FactionType.Ivits) {
          nextIndex--;
        }

        return {
          playerIndex: nextIndex,
          pass: BuildFirstMinesPass.Second,
        };
      }

      return {
        playerIndex: nextIndex,
        pass: BuildFirstMinesPass.First,
      };
    },

    [BuildFirstMinesPass.Second]: (players, currentIndex) => {
      let nextIndex = currentIndex - 1;

      if (nextIndex < 0) {
        // If a player is playing as the Xenos, then they are allowed to place a third mine after everyone has placed their second.
        nextIndex = players.findIndex(
          (player) => player.faction.factionType === FactionType.Xenos,
        );
        if (nextIndex > -1) {
          return {
            playerIndex: nextIndex,
            pass: BuildFirstMinesPass.Xenos,
          };
        }

        // If a player is playing as the Ivits, then they can now place their Planetary Institute.
        nextIndex = players.findIndex(
          (player) => player.faction.factionType === FactionType.Ivits,
        );
        if (nextIndex > -1) {
          return {
            playerIndex: nextIndex,
            pass: BuildFirstMinesPass.Ivits,
          };
        }

        return null;
      }

      return {
        pass: BuildFirstMinesPass.Second,
        playerIndex: nextIndex,
      };
    },

    [BuildFirstMinesPass.Xenos]: (players) => {
      // If a player is playing as the Ivits, then they can now place their Planetary Institute.
      const nextIndex = players.findIndex(
        (player) => player.faction.factionType === FactionType.Ivits,
      );

      if (nextIndex > -1) {
        return {
          playerIndex: nextIndex,
          pass: BuildFirstMinesPass.Ivits,
        };
      }

      return null;
    },

    [BuildFirstMinesPass.Ivits]: () => null,
  };

  static determineNextState(
    pass: BuildFirstMinesPass,
    players: Readonly<Player[]>,
    currentIndex: number,
  ): BuildFirstMinesOptions | null {
    return BuildFirstMinesTurnOrder.strategies[pass](players, currentIndex);
  }
}
