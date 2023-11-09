import { Income } from '../interfaces';

function addResource(
  currentValue: number | undefined,
  addition: number | undefined,
): number | undefined {
  if (typeof addition === 'number') {
    return typeof currentValue === 'number'
      ? currentValue + addition
      : addition;
  }

  return currentValue;
}

function reducer(total: Income, currrentValue: Income): Income {
  return {
    chargePower: addResource(total.chargePower, currrentValue.chargePower),
    credits: addResource(total.credits, currrentValue.credits),
    knowledge: addResource(total.knowledge, currrentValue.knowledge),
    ore: addResource(total.ore, currrentValue.ore),
    powerNodes: addResource(total.powerNodes, currrentValue.powerNodes),
    qic: addResource(total.qic, currrentValue.qic),
  };
}

/**
 * Combines multiple @see Income objects together into one.
 * @param income Income objects to combine.
 * @returns Returns a single, unified @see Income object.
 */
export function reduceIncome(...income: Income[]): Income {
  return income.reduce(reducer, {});
}
