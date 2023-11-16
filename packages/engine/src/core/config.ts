export type GameConfig = {
  cheats: Partial<{
    /** Players start with 999 of every resource. */
    resources: boolean;
  }>;
};
