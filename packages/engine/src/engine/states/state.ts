export interface State {
  // Player actions
  buildMine(): void;
  startGaiaProject(): void;
  upgradeStructure(): void;
  formFederation(): void;
  advanceResearch(): void;
  powerOrQicAction(): void;
  specialAction(): void;
  freeAction(): void;
  pass(): void;

  // Await player decision
  waitForPlayer(): void;

  // Maintenance
  doIncome(): void;
  doRoundCleanup(): void;
  doEndGameScoring(): void;

  // Player stuff
  addPlayer(): void;
  removePlayer(): void;
}
