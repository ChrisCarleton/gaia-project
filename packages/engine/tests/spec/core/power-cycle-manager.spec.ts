import { GPError, PowerCycle } from '../../../src';
import { PowerCycleManager } from '../../../src/core/power-cycle-manager';

function createManager(powerCycle?: Partial<PowerCycle>): PowerCycleManager {
  return new PowerCycleManager({
    level1: 0,
    level2: 0,
    level3: 0,
    gaia: 0,
    ...powerCycle,
  });
}

describe('Power Cycle Manager', () => {
  it('will be initialized with an empty power cycle if nothing is passed into the constructor', () => {
    const manager = new PowerCycleManager();
    expect(manager.level1).toBe(0);
    expect(manager.level2).toBe(0);
    expect(manager.level3).toBe(0);
    expect(manager.gaia).toBe(0);
    expect(manager.brainStonePosition).toBeUndefined();
  });

  it('will return power cycle properties correctly', () => {
    const expected: PowerCycle = {
      level1: 4,
      level2: 3,
      level3: 5,
      gaia: 6,
    };
    const manager = createManager(expected);
    expect(manager.level1).toEqual(expected.level1);
    expect(manager.level2).toEqual(expected.level2);
    expect(manager.level3).toEqual(expected.level3);
    expect(manager.gaia).toEqual(expected.gaia);
  });

  it('will return computed values correctly', () => {
    const expected: PowerCycle = {
      level1: 4,
      level2: 3,
      level3: 5,
      gaia: 6,
    };
    const manager = createManager(expected);
    expect(manager.totalNodesInCycle).toBe(12);
    expect(manager.totalUncharged).toBe(7);
    expect(manager.totalCharged).toBe(5);
  });

  it('will count a fully-charged brainstone as three nodes', () => {
    const manager = createManager({ level3: 2, brainStonePosition: 3 });
    expect(manager.totalCharged).toBe(4);
  });

  it('will count an uncharged brainstone as one node', () => {
    const manager = createManager({
      level1: 2,
      level2: 3,
      brainStonePosition: 2,
    });
    expect(manager.totalUncharged).toBe(5);
  });

  it('will manually set power cycle values correctly', () => {
    const expected: PowerCycle = {
      level1: 4,
      level2: 3,
      level3: 5,
      gaia: 6,
      brainStonePosition: 1,
    };
    const manager = createManager();
    manager.setValues(expected);
    expect(manager.level1).toEqual(expected.level1);
    expect(manager.level2).toEqual(expected.level2);
    expect(manager.level3).toEqual(expected.level3);
    expect(manager.gaia).toEqual(expected.gaia);
    expect(manager.brainStonePosition).toEqual(expected.brainStonePosition);
  });

  describe('when adding nodes', () => {
    it('will add the indicated number of nodes to level 1 when it is empty', () => {
      const manager = createManager();
      manager.addNodes(4);
      expect(manager.level1).toBe(4);
    });

    it('will add the indicated number of nodes to level 1 when it already contains nodes', () => {
      const manager = createManager({ level1: 3 });
      manager.addNodes(4);
      expect(manager.level1).toBe(7);
    });

    it('will not error when adding zero nodes', () => {
      const manager = createManager({ level1: 3 });
      manager.addNodes(0);
      expect(manager.level1).toBe(3);
    });

    it('will throw an error when adding a negative number of nodes', () => {
      const manager = createManager();
      expect(() => manager.addNodes(-1)).toThrowError();
    });
  });

  ['remove', 'allocate'].forEach((scenario) => {
    describe(`when ${
      scenario === 'remove'
        ? 'removing nodes'
        : 'allocating nodes for Gaia Project'
    }`, () => {
      function removeOrAllocate(manager: PowerCycleManager, nodes: number) {
        if (scenario === 'remove') manager.removeNodes(nodes);
        else manager.allocateGaiaNodes(nodes);
      }

      function assertAllocation(manager: PowerCycleManager, nodes: number) {
        if (scenario === 'allocate') expect(manager.gaia).toBe(nodes);
      }

      it(`will ${scenario} all nodes from level 1 if possible`, () => {
        const manager = createManager({ level1: 5 });
        removeOrAllocate(manager, 4);
        expect(manager.level1).toBe(1);
        assertAllocation(manager, 4);
      });

      it(`will ${scenario} nodes from levels 1 and 2 if necessary`, () => {
        const manager = createManager({ level1: 2, level2: 4 });
        removeOrAllocate(manager, 5);
        expect(manager.level1).toBe(0);
        expect(manager.level2).toBe(1);
        assertAllocation(manager, 5);
      });

      it(`will ${scenario} nodes from levels 1, 2, and 3 if necessary`, () => {
        const manager = createManager({ level1: 2, level2: 1, level3: 4 });
        removeOrAllocate(manager, 5);
        expect(manager.level1).toBe(0);
        expect(manager.level2).toBe(0);
        expect(manager.level3).toBe(2);
        assertAllocation(manager, 5);
      });

      it(`will do nothing if asked to ${scenario} zero nodes`, () => {
        const manager = createManager({ level1: 2, level2: 1, level3: 4 });
        removeOrAllocate(manager, 0);
        expect(manager.level1).toBe(2);
        expect(manager.level2).toBe(1);
        expect(manager.level3).toBe(4);
        assertAllocation(manager, 0);
      });

      it(`will ${scenario} all nodes if necessary`, () => {
        const manager = createManager({ level1: 2, level2: 1, level3: 4 });
        removeOrAllocate(manager, 7);
        expect(manager.level1).toBe(0);
        expect(manager.level2).toBe(0);
        expect(manager.level3).toBe(0);
        assertAllocation(manager, 7);
      });

      it(`will throw an error if asked to ${scenario} a negative number of nodes`, () => {
        const manager = createManager({ level1: 2, level2: 1, level3: 4 });
        expect(() => removeOrAllocate(manager, -2)).toThrowError();
      });

      it(`will throw an error if asked to ${scenario} more nodes than the user has in their power cycle`, () => {
        const manager = createManager({ level1: 2, level2: 1, level3: 4 });
        expect(() => removeOrAllocate(manager, 8)).toThrowError();
      });

      describe('when the brainstone is present', () => {
        it(`will ${scenario} an alternate node from level 3 to avoid removing brainstone`, () => {
          const manager = createManager({ level3: 3, brainStonePosition: 3 });
          removeOrAllocate(manager, 2);
          expect(manager.level3).toBe(1);
          expect(manager.brainStonePosition).toBe(3);
          assertAllocation(manager, 2);
        });

        it(`will ${scenario} a node from level 3 to avoid removing brainstone from level 2`, () => {
          const manager = createManager({
            level2: 2,
            level3: 3,
            brainStonePosition: 2,
          });
          removeOrAllocate(manager, 4);
          expect(manager.level2).toBe(1);
          expect(manager.level3).toBe(0);
          expect(manager.brainStonePosition).toBe(2);
          assertAllocation(manager, 4);
        });

        it(`will ${scenario} a node from level 2 to avoid removing brainstone from level 1`, () => {
          const manager = createManager({
            level1: 2,
            level2: 2,
            level3: 3,
            brainStonePosition: 1,
          });
          removeOrAllocate(manager, 3);
          expect(manager.level1).toBe(1);
          expect(manager.level2).toBe(0);
          expect(manager.level3).toBe(3);
          expect(manager.brainStonePosition).toBe(1);
          assertAllocation(manager, 3);
        });

        it(`will ${scenario} a node from level three to avoid removing brainstone from level 1 when there are no nodes left in level 2`, () => {
          const manager = createManager({
            level1: 2,
            level2: 2,
            level3: 2,
            brainStonePosition: 1,
          });
          removeOrAllocate(manager, 5);
          expect(manager.level1).toBe(1);
          expect(manager.level2).toBe(0);
          expect(manager.level3).toBe(0);
          expect(manager.brainStonePosition).toBe(1);
          assertAllocation(manager, 5);
        });

        it(`will ${scenario} the brainstone as a last resort`, () => {
          const manager = createManager({
            level1: 2,
            level2: 2,
            level3: 2,
            brainStonePosition: 2,
          });
          removeOrAllocate(manager, 6);
          expect(manager.level1).toBe(0);
          expect(manager.level2).toBe(0);
          expect(manager.level3).toBe(0);
          expect(manager.brainStonePosition).toBe(
            scenario === 'remove' ? undefined : 'gaia',
          );
          assertAllocation(manager, 6);
        });
      });
    });
  });

  describe('when adding nodes', () => {
    it('will add the correct number of nodes to level 1', () => {
      const manager = createManager({ level1: 2 });
      manager.addNodes(7);
      expect(manager.level1).toBe(9);
    });

    it('will do nothing when adding zero nodes', () => {
      const manager = createManager({ level1: 4 });
      manager.addNodes(0);
      expect(manager.level1).toBe(4);
    });

    it('will throw an error when adding a negative number of nodes', () => {
      const manager = createManager();
      expect(() => manager.addNodes(-1)).toThrowError();
    });
  });

  describe('when charging nodes', () => {
    it('will charge level 1 nodes first', () => {
      const manager = createManager({ level1: 5, level2: 1 });
      expect(manager.chargeNodes(4)).toBe(4);
      expect(manager.level1).toBe(1);
      expect(manager.level2).toBe(5);
      expect(manager.level3).toBe(0);
    });

    it('will charge level 2 nodes if no level 1 nodes are present', () => {
      const manager = createManager({ level1: 0, level2: 5, level3: 1 });
      expect(manager.chargeNodes(4)).toBe(4);
      expect(manager.level1).toBe(0);
      expect(manager.level2).toBe(1);
      expect(manager.level3).toBe(5);
    });

    it('will charge level 1 and 2 nodes if there are insufficient level 1 nodes', () => {
      const manager = createManager({ level1: 2, level2: 5, level3: 1 });
      expect(manager.chargeNodes(4)).toBe(4);
      expect(manager.level1).toBe(0);
      expect(manager.level2).toBe(5);
      expect(manager.level3).toBe(3);
    });

    it('will charge as many nodes as possible and ignore the rest if necessary', () => {
      const manager = createManager({ level1: 2, level2: 3, level3: 1 });
      expect(manager.chargeNodes(9)).toBe(7);
      expect(manager.level1).toBe(0);
      expect(manager.level2).toBe(0);
      expect(manager.level3).toBe(6);
    });

    it('will charge nothing if there are no uncharged nodes', () => {
      const manager = createManager({ level3: 4 });
      expect(manager.chargeNodes(2)).toBe(0);
      expect(manager.level1).toBe(0);
      expect(manager.level2).toBe(0);
      expect(manager.level3).toBe(4);
    });

    it('will do nothing if charging zero nodes', () => {
      const manager = createManager({ level1: 2, level2: 3, level3: 1 });
      expect(manager.chargeNodes(0)).toBe(0);
      expect(manager.level1).toBe(2);
      expect(manager.level2).toBe(3);
      expect(manager.level3).toBe(1);
    });

    it('will throw an error if charging a negative number of nodes', () => {
      const manager = createManager();
      expect(() => manager.chargeNodes(-1)).toThrowError();
    });

    describe('when brainstone is present', () => {
      it('will charge the brainstone from level 1 to 2 if possible', () => {
        const manager = createManager({
          level1: 4,
          level2: 1,
          brainStonePosition: 1,
        });
        expect(manager.chargeNodes(2)).toBe(2);
        expect(manager.level1).toBe(2);
        expect(manager.level2).toBe(3);
        expect(manager.brainStonePosition).toBe(2);
      });

      it('will charge the brainstone from level 2 to 3 if possible', () => {
        const manager = createManager({
          level1: 1,
          level2: 5,
          level3: 6,
          brainStonePosition: 2,
        });
        expect(manager.chargeNodes(3)).toBe(3);
        expect(manager.level1).toBe(0);
        expect(manager.level2).toBe(4);
        expect(manager.level3).toBe(8);
        expect(manager.brainStonePosition).toBe(3);
      });

      it('will charge the brainstone all the way from level 1 to 3 if possible', () => {
        const manager = createManager({
          level1: 2,
          level2: 1,
          level3: 6,
          brainStonePosition: 1,
        });
        expect(manager.chargeNodes(3)).toBe(3);
        expect(manager.level1).toBe(0);
        expect(manager.level2).toBe(2);
        expect(manager.level3).toBe(7);
        expect(manager.brainStonePosition).toBe(3);
      });

      it('will not charge the brainstone if there are too many nodes with a lesser charge to do first', () => {
        const manager = createManager({
          level1: 3,
          level2: 1,
          level3: 6,
          brainStonePosition: 2,
        });
        expect(manager.chargeNodes(3)).toBe(3);
        expect(manager.level1).toBe(0);
        expect(manager.level2).toBe(4);
        expect(manager.level3).toBe(6);
        expect(manager.brainStonePosition).toBe(2);
      });
    });
  });

  describe('when spending nodes', () => {
    it('will spend the correct number of nodes', () => {
      const manager = createManager({ level1: 2, level3: 4 });
      manager.spendNodes(3);
      expect(manager.level1).toBe(5);
      expect(manager.level3).toBe(1);
    });

    it('will throw an error if there are insufficient charged nodes', () => {
      const manager = createManager({ level3: 1 });
      expect(() => manager.spendNodes(3)).toThrowError(GPError);
    });

    it('will do nothing if spending zero nodes', () => {
      const manager = createManager({ level1: 2, level3: 4 });
      manager.spendNodes(0);
      expect(manager.level1).toBe(2);
      expect(manager.level3).toBe(4);
    });

    it('will throw an error if spending a negative number of nodes', () => {
      const manager = createManager({ level3: 1 });
      expect(() => manager.spendNodes(-1)).toThrowError();
    });

    describe('when brainstone is charged', () => {
      it('will use the brainstone if spending more than three nodes', () => {
        const manager = createManager({ level3: 3, brainStonePosition: 3 });
        manager.spendNodes(4);
        expect(manager.level1).toBe(2);
        expect(manager.level3).toBe(1);
        expect(manager.brainStonePosition).toBe(1);
      });

      it('will use the brainstone if spending three nodes', () => {
        const manager = createManager({ level3: 3, brainStonePosition: 3 });
        manager.spendNodes(3);
        expect(manager.level1).toBe(1);
        expect(manager.level3).toBe(2);
        expect(manager.brainStonePosition).toBe(1);
      });

      it('will use regular nodes if spending less than three nodes', () => {
        const manager = createManager({ level3: 3, brainStonePosition: 3 });
        manager.spendNodes(2);
        expect(manager.level1).toBe(2);
        expect(manager.level3).toBe(1);
        expect(manager.brainStonePosition).toBe(3);
      });

      it('will use the brainstone if spending less than three nodes but there are insufficient regular nodes charged', () => {
        const manager = createManager({ level3: 2, brainStonePosition: 3 });
        manager.spendNodes(2);
        expect(manager.level1).toBe(1);
        expect(manager.level3).toBe(1);
        expect(manager.brainStonePosition).toBe(1);
      });
    });
  });

  describe('when restoring Gaia Project nodes', () => {
    it('will restore all Gaia nodes back to level 1', () => {
      const manager = createManager({ gaia: 6, level1: 1, level2: 3 });
      manager.restoreGaiaNodes();
      expect(manager.gaia).toBe(0);
      expect(manager.level1).toBe(7);
      expect(manager.level2).toBe(3);
    });

    it('will restore all Gaia nodes back to level 2 for Terrans', () => {
      const manager = createManager({ gaia: 6, level2: 2 });
      manager.restoreGaiaNodes(true);
      expect(manager.gaia).toBe(0);
      expect(manager.level1).toBe(0);
      expect(manager.level2).toBe(8);
    });

    it('will do nothing if Gaia area is empty', () => {
      const manager = createManager();
      manager.restoreGaiaNodes();
      expect(manager.level1).toBe(0);
      expect(manager.gaia).toBe(0);
    });

    it('will restore the brainstone if it is present in the Gaia area', () => {
      const manager = createManager({
        gaia: 6,
        level1: 1,
        level2: 3,
        brainStonePosition: 'gaia',
      });
      manager.restoreGaiaNodes();
      expect(manager.gaia).toBe(0);
      expect(manager.level1).toBe(7);
      expect(manager.level2).toBe(3);
      expect(manager.brainStonePosition).toBe(1);
    });
  });
});
