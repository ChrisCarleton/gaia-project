import { PowerCycle, PowerCycleManager } from '..';

export class PowerCycleManagerInstance implements PowerCycleManager {
  private readonly _powerCycle: PowerCycle;

  constructor(powerCycle?: PowerCycle) {
    this._powerCycle = powerCycle ?? {
      level1: 0,
      level2: 0,
      level3: 0,
      gaia: 0,
    };
  }

  addNodes(nodes: number): void {
    if (nodes < 1) throw new Error('Cannot add a negative number of nodes.');
    this._powerCycle.level1 += nodes;
  }

  removeNodes(nodes: number): number {
    // Remove nodes with the least charge first and remove fully-charged nodes as a last resort.
    if (nodes < 1) throw new Error('Cannot remove a negative number of nodes.');

    let removed = 0;

    if (this._powerCycle.level1 >= nodes) {
      this._powerCycle.level1 -= nodes;
      return nodes;
    } else if (this._powerCycle.level1 > 0) {
      removed += nodes;
      nodes -= this._powerCycle.level1;
      this._powerCycle.level1 = 0;
    }

    if (this._powerCycle.level2 >= nodes) {
      this._powerCycle.level2 -= nodes;
      return removed + nodes;
    } else if (this._powerCycle.level2 > 0) {
      removed += nodes;
      nodes -= this._powerCycle.level1;
      this._powerCycle.level2 = 0;
    }

    if (this._powerCycle.level3 >= nodes) {
      this._powerCycle.level3 -= nodes;
      nodes += removed;
    } else if (this._powerCycle.level3 > 0) {
      removed += nodes;
      this._powerCycle.level3 = 0;
    }

    return removed;
  }

  chargeNodes(nodes: number): number {
    // Charge least charged nodes first (according to the rules).
    if (nodes < 1) throw new Error('Cannot charge a negative number of nodes.');

    let charged = 0;

    if (this._powerCycle.level1 >= nodes) {
      this._powerCycle.level1 -= nodes;
      this._powerCycle.level2 += nodes;
      return nodes;
    } else if (this._powerCycle.level1 > 0) {
      charged += this._powerCycle.level1;
      this._powerCycle.level2 += this._powerCycle.level1;
      nodes -= this._powerCycle.level1;
      this._powerCycle.level1 = 0;
    }

    if (this._powerCycle.level2 >= nodes) {
      this._powerCycle.level2 -= nodes;
      this._powerCycle.level3 += nodes;
      return charged + nodes;
    } else if (this._powerCycle.level2 > 0) {
      charged += this._powerCycle.level2;
      this._powerCycle.level3 += this._powerCycle.level2;
      this._powerCycle.level2 = 0;
    }

    return charged;
  }

  get level1(): number {
    return this._powerCycle.level1;
  }

  get level2(): number {
    return this._powerCycle.level2;
  }

  get level3(): number {
    return this._powerCycle.level3;
  }

  get gaia(): number {
    return this._powerCycle.gaia;
  }

  get totalUncharged(): number {
    return this.level1 + this.level2;
  }
}
