describe('Pass Action', () => {
  it.todo('will throw an error if an invalid roundbooster is selected');

  for (let round = 1; round < 6; round++) {
    it.todo(
      `will throw an error if no round booster is selected in round ${round}`,
    );
  }

  it.todo("will return the player's round booster to the supply");

  it.todo('will advance to the next player in turn order');

  it.todo(
    'will advance to the next player in turn order who has not yet passed',
  );

  it.todo('will advance back to the start of turn order when we reach the end');

  it.todo('will advance to the cleanup phase when all players have passed');
});
