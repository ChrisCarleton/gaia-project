import { FactionType, Player } from '../../../src';
import {
  BuildFirstMinesPass,
  BuildFirstMinesTurnOrder,
} from '../../../src/states/build-first-mines-turn-order';
import { createTestPlayer } from '../../util';

describe('Build First Mines turn order logic', () => {
  let players: Player[];

  beforeEach(() => {
    players = [
      createTestPlayer({ faction: FactionType.Terrans }),
      createTestPlayer({ faction: FactionType.Geodens }),
      createTestPlayer({ faction: FactionType.Nevlas }),
      createTestPlayer({ faction: FactionType.Bescods }),
    ];
  });

  it('will follow turn order on the first pass', () => {
    for (let i = 0; i < players.length - 1; i++) {
      const options = BuildFirstMinesTurnOrder.determineNextState(
        BuildFirstMinesPass.First,
        players,
        i,
      );
      expect(options).toEqual({
        playerIndex: i + 1,
        pass: BuildFirstMinesPass.First,
      });
    }
  });

  it('will skip over Ivits on first pass', () => {
    players.splice(1, 1, createTestPlayer({ faction: FactionType.Ivits }));
    const options = BuildFirstMinesTurnOrder.determineNextState(
      BuildFirstMinesPass.First,
      players,
      0,
    );
    expect(options).toEqual({
      playerIndex: 2,
      pass: BuildFirstMinesPass.First,
    });
  });

  it('will advance to second pass after last player places their mine', () => {
    const options = BuildFirstMinesTurnOrder.determineNextState(
      BuildFirstMinesPass.First,
      players,
      3,
    );
    expect(options).toEqual({
      playerIndex: 3,
      pass: BuildFirstMinesPass.Second,
    });
  });

  it('will advance to second pass early if the last player in turn order are playing as Ivits', () => {
    players.splice(3, 1, createTestPlayer({ faction: FactionType.Ivits }));
    const options = BuildFirstMinesTurnOrder.determineNextState(
      BuildFirstMinesPass.First,
      players,
      2,
    );
    expect(options).toEqual({
      playerIndex: 2,
      pass: BuildFirstMinesPass.Second,
    });
  });

  it('will follow reverse turn order on the second pass', () => {
    for (let i = players.length - 1; i > 0; i--) {
      const options = BuildFirstMinesTurnOrder.determineNextState(
        BuildFirstMinesPass.Second,
        players,
        i,
      );
      expect(options).toEqual({
        playerIndex: i - 1,
        pass: BuildFirstMinesPass.Second,
      });
    }
  });

  it('will advance to the first income phase after all players have placed their mines', () => {
    const options = BuildFirstMinesTurnOrder.determineNextState(
      BuildFirstMinesPass.Second,
      players,
      0,
    );
    expect(options).toBeNull();
  });

  it('will allow the Xenos to place a third mine after the second pass', () => {
    players.splice(1, 1, createTestPlayer({ faction: FactionType.Xenos }));
    const options = BuildFirstMinesTurnOrder.determineNextState(
      BuildFirstMinesPass.Second,
      players,
      0,
    );
    expect(options).toEqual({
      playerIndex: 1,
      pass: BuildFirstMinesPass.Xenos,
    });
  });

  it('will allow the Ivits to place their planetary institute after the second pass', () => {
    players.splice(2, 1, createTestPlayer({ faction: FactionType.Ivits }));
    const options = BuildFirstMinesTurnOrder.determineNextState(
      BuildFirstMinesPass.Second,
      players,
      0,
    );
    expect(options).toEqual({
      playerIndex: 2,
      pass: BuildFirstMinesPass.Ivits,
    });
  });

  it('will advance to the first income phase after the Xenos have placed their third mine', () => {
    players.splice(1, 1, createTestPlayer({ faction: FactionType.Xenos }));
    const options = BuildFirstMinesTurnOrder.determineNextState(
      BuildFirstMinesPass.Xenos,
      players,
      1,
    );
    expect(options).toBeNull();
  });

  it('will allow the Ivits to place their planetary institute after the Xenos have placed their third mine', () => {
    players.splice(
      1,
      2,
      createTestPlayer({ faction: FactionType.Ivits }),
      createTestPlayer({ faction: FactionType.Xenos }),
    );
    const options = BuildFirstMinesTurnOrder.determineNextState(
      BuildFirstMinesPass.Xenos,
      players,
      2,
    );
    expect(options).toEqual({
      playerIndex: 1,
      pass: BuildFirstMinesPass.Ivits,
    });
  });

  it('will advance to the first income phase after the ivits have placed their planetary institute', () => {
    players.splice(2, 1, createTestPlayer({ faction: FactionType.Ivits }));
    const options = BuildFirstMinesTurnOrder.determineNextState(
      BuildFirstMinesPass.Ivits,
      players,
      2,
    );
    expect(options).toBeNull();
  });
});
