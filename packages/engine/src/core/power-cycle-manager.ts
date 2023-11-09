import { ErrorCode, GPError, PowerCycle } from '..';

export class PowerCycleManager implements Readonly<PowerCycle> {
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
    if (nodes < 0) throw new Error('Cannot add a negative number of nodes.');
    this._powerCycle.level1 += nodes;
  }

  removeNodes(nodes: number): void {
    // Remove nodes with the least charge first and remove fully-charged nodes as a last resort.
    if (nodes < 0) throw new Error('Cannot remove a negative number of nodes.');
    if (nodes > this.totalNodesInCycle) {
      throw new GPError(
        ErrorCode.InsufficientPower,
        `Unable to remove ${nodes} from your power cycle. You do not have that many nodes.`,
      );
    }

    const removingAllNodes = nodes === this.totalNodesInCycle;
    this.removeNodesFromPowerCycle(nodes);

    // Avoid taking the brainstone except as a last resort.
    const brainstoneInCycle =
      this.brainStonePosition === 1 ||
      this.brainStonePosition === 2 ||
      this.brainStonePosition === 3;

    if (brainstoneInCycle) {
      if (removingAllNodes) {
        // Remove the brainstone only as a last resort if we're removing ALL nodes from the cycle.
        this._powerCycle.brainStonePosition = undefined;
      } else {
        // Otherwise, make sure the brainstone stays where it is and sacrifice a more highly charged node in its place, if necessary.
        // If there are other nodes available in the brainstone's present level we can just assume that one of those were used.
        if (this.brainStonePosition === 1 && this.level1 === 0) {
          // Find an available node in level 2 or 3 to use instead.
          this._powerCycle.level1 += 1;
          if (this.level2 > 0) {
            this._powerCycle.level2 -= 1;
          } else {
            this._powerCycle.level3 -= 1;
          }
        }

        if (this.brainStonePosition === 2 && this.level2 === 0) {
          // Remove an available node in level 3 instead.
          this._powerCycle.level2 += 1;
          this._powerCycle.level3 -= 1;
        }
      }
    }
  }

  chargeNodes(nodes: number): number {
    // Charge least charged nodes first (mandatory, according to the rules).
    // Always try to charge the brainstone if possible since it is the most valuable node when fully-charged.
    if (nodes < 0) throw new Error('Cannot charge a negative number of nodes.');

    let charged = 0;

    if (
      this._powerCycle.level1 > 0 &&
      this._powerCycle.brainStonePosition === 1
    ) {
      this._powerCycle.brainStonePosition = 2;
    }

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

    if (
      this._powerCycle.level2 > 0 &&
      this._powerCycle.brainStonePosition === 2
    ) {
      this._powerCycle.brainStonePosition = 3;
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

  spendNodes(nodes: number): void {
    if (nodes < 0) {
      throw new Error('You cannot spend a negative number of nodes.');
    }

    // Validate that we have enough power available. (Brainstone counts as three nodes if it is fully charged.)
    if (nodes > this.totalCharged) {
      throw new GPError(
        ErrorCode.InsufficientPower,
        `You need ${nodes} charged power nodes to complete this action but you only have ${this.totalCharged} available.`,
      );
    }

    /*
      Special logic applies if the brainstone is fully-charged:
        - If we need to spend three or more power, we'll use the brainstone.
        - If we need to spend less than three power, use regular nodes.
        - If we need to spend less than three power but we do not have sufficient regular nodes, we need sacrifice the brainstone.
    */
    if (this.brainStonePosition === 3) {
      if (nodes >= 3) {
        // Use the brainstone to "lower the cost" by two.
        nodes -= 2;
        this._powerCycle.brainStonePosition = 1;
      }

      if (this.level3 - 1 < nodes) {
        // If we do not have sufficient regular nodes then we have to sacrifice the brainstone.
        this._powerCycle.level1 += 1;
        this._powerCycle.level3 -= 1;
        this._powerCycle.brainStonePosition = 1;
        return;
      }
    }

    // Otherwise, just spend nodes regularly.
    this._powerCycle.level3 -= nodes;
    this._powerCycle.level1 += nodes;
  }

  allocateGaiaNodes(nodes: number): void {
    const brainstoneInCycle =
      this.brainStonePosition === 1 ||
      this.brainStonePosition === 2 ||
      this.brainStonePosition === 3;
    const allocateBrainstone =
      brainstoneInCycle && nodes === this.totalNodesInCycle;

    this.removeNodes(nodes);
    this._powerCycle.gaia += nodes;

    if (allocateBrainstone) this._powerCycle.brainStonePosition = 'gaia';
  }

  restoreGaiaNodes(isTerrans: boolean = false): void {
    const nodes = this.gaia;
    this._powerCycle.gaia = 0;

    // If the brainstone was in the Gaia area, make sure it goes back into the power cycle.
    if (this.brainStonePosition === 'gaia') {
      this._powerCycle.brainStonePosition = 1;
    }

    // Return all power nodes from the Gaia area back to Level 1.
    //   Exception: As an ability the Terran's power nodes are returned to Level 2 instead.
    if (isTerrans) this._powerCycle.level2 += nodes;
    else this._powerCycle.level1 += nodes;
  }

  setValues(values: PowerCycle): void {
    this._powerCycle.gaia = values.gaia;
    this._powerCycle.level1 = values.level1;
    this._powerCycle.level2 = values.level2;
    this._powerCycle.level3 = values.level3;
    this._powerCycle.brainStonePosition = values.brainStonePosition;
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

  get brainStonePosition(): 'gaia' | 1 | 2 | 3 | undefined {
    return this._powerCycle.brainStonePosition;
  }

  get totalUncharged(): number {
    return this.level1 + this.level2;
  }

  get totalCharged(): number {
    // If the brainstone is one of the level 3 nodes, it behaves as if it were three nodes.
    return this.brainStonePosition === 3 ? this.level3 + 2 : this.level3;
  }

  get totalNodesInCycle(): number {
    return this.level1 + this.level2 + this.level3;
  }

  private removeNodesFromPowerCycle(nodes: number): void {
    if (this.level1 >= nodes) {
      // We can remove all nodes from level 1.
      this._powerCycle.level1 -= nodes;
      return;
    } else {
      // Remove all nodes from level 1 and then continue looking.
      nodes -= this.level1;
      this._powerCycle.level1 = 0;
    }

    if (this.level2 >= nodes) {
      // We can remove remaining nodes from level 2.
      this._powerCycle.level2 -= nodes;
      return;
    } else {
      // Remove all nodes from level 2 and then continue looking.
      nodes -= this.level2;
      this._powerCycle.level2 = 0;
    }

    // Remove remaining nodes from level 3.
    this._powerCycle.level3 -= nodes;
  }
}
