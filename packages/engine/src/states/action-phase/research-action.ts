import { ResearchAreaNames } from '../../constants';
import { ErrorCode, GPError } from '../../errors';
import { EventType, ObserverPublisher } from '../../events';
import {
  GameContext,
  Income,
  Map,
  PlanetType,
  Player,
  ResearchArea,
  StructureType,
} from '../../interfaces';
import { reduceIncome } from '../../utils';

enum ResearchOneTimeBonusType {
  FederationToken = 'federationToken',
  Gaiaformer = 'gaiaformer',
  Resources = 'resources',
  LostPlanet = 'lostPlanet',
  VictoryPointsForGaiaPlanets = 'vpForGaiaPlanets',
}

const ColonizingStructures: Set<StructureType> = new Set([
  StructureType.Academy,
  StructureType.Mine,
  StructureType.PlanetaryInstitute,
  StructureType.ResearchLab,
  StructureType.TradingStation,
]);

type ResearchOneTimeBonus =
  | { type: ResearchOneTimeBonusType.Resources; resources: Income }
  | {
      type:
        | ResearchOneTimeBonusType.FederationToken
        | ResearchOneTimeBonusType.Gaiaformer
        | ResearchOneTimeBonusType.LostPlanet
        | ResearchOneTimeBonusType.VictoryPointsForGaiaPlanets;
    };

const ResearchOneTimeBonuses: Record<
  ResearchArea,
  Readonly<(ResearchOneTimeBonus | null)[]>
> = {
  [ResearchArea.AI]: [
    { type: ResearchOneTimeBonusType.Resources, resources: { qic: 1 } },
    { type: ResearchOneTimeBonusType.Resources, resources: { qic: 1 } },
    { type: ResearchOneTimeBonusType.Resources, resources: { qic: 2 } },
    { type: ResearchOneTimeBonusType.Resources, resources: { qic: 2 } },
    { type: ResearchOneTimeBonusType.Resources, resources: { qic: 4 } },
  ],
  [ResearchArea.Economics]: [
    null,
    null,
    null,
    null,
    {
      type: ResearchOneTimeBonusType.Resources,
      resources: {
        chargePower: 6,
        credits: 6,
        ore: 3,
      },
    },
  ],
  [ResearchArea.Gaia]: [
    { type: ResearchOneTimeBonusType.Gaiaformer },
    { type: ResearchOneTimeBonusType.Resources, resources: { powerNodes: 3 } },
    { type: ResearchOneTimeBonusType.Gaiaformer },
    { type: ResearchOneTimeBonusType.Gaiaformer },
    { type: ResearchOneTimeBonusType.VictoryPointsForGaiaPlanets },
  ],
  [ResearchArea.Navigation]: [
    { type: ResearchOneTimeBonusType.Resources, resources: { qic: 1 } },
    null,
    { type: ResearchOneTimeBonusType.Resources, resources: { qic: 1 } },
    null,
    { type: ResearchOneTimeBonusType.LostPlanet },
  ],
  [ResearchArea.Science]: [
    null,
    null,
    null,
    null,
    { type: ResearchOneTimeBonusType.Resources, resources: { knowledge: 9 } },
  ],
  [ResearchArea.Terraforming]: [
    { type: ResearchOneTimeBonusType.Resources, resources: { ore: 2 } },
    null,
    null,
    { type: ResearchOneTimeBonusType.Resources, resources: { ore: 2 } },
    { type: ResearchOneTimeBonusType.FederationToken },
  ],
} as const;

export class ResearchAction {
  private computeVPForColonizedGaiaPlanets(map: Map, player: Player): number {
    let vp = 4;

    // Add one VP for every colonized Gaia planet belonging to the player.
    // TODO: This is not the most efficient way to compute this. Consider improving it later.
    for (const hex of Object.values(map)) {
      if (
        hex.planet &&
        hex.planet.type === PlanetType.Gaia &&
        hex.planet.structure &&
        ColonizingStructures.has(hex.planet.structure) &&
        hex.planet.player?.id === player.id
      ) {
        vp++;
      }
    }

    return vp;
  }

  research(
    context: GameContext,
    player: Player,
    events: ObserverPublisher,
    area: ResearchArea,
  ) {
    const bonusResources: Income[] = [];

    // 1. Player must have 4 knowledge available in order to advance in a research track.
    if (player.resources.knowledge < 4) {
      throw new GPError(
        ErrorCode.InsufficientKnowledge,
        'Unable to advance research. Player must have at least 4 knowledge.',
      );
    }

    // 2. If the player is advancing to level 5 in a given track additional rules apply:
    if (player.research[area] === 4) {
      // a. Only one player may occupy level 5 in each of the research tracks.
      for (const otherPlayer of context.players) {
        if (otherPlayer.research[area] === 5) {
          throw new GPError(
            ErrorCode.ResearchTrackTierFiveOccupied,
            `Unable to advance to tier 5 in the ${ResearchAreaNames[area]} track. It is already occupied by ${otherPlayer.name}.`,
          );
        }
      }

      // b. Player must have an unactivated federation token available.
      // TODO: Write me once Tech Tiles are a thing.
    }

    const levelAchieved = player.research[area] + 1;

    // 3. If the player is advancing to level 3 in any given track then they automatically get to charge three power nodes.
    if (levelAchieved === 3) {
      bonusResources.push({ chargePower: 3 });
    }

    /*
      TODO: Perform action.
        5. If advancing to level 5:
          a. Player must choose a federation token to activate.
          b. Player may have to choose location of lost planet.
    */
    // 4. Player pays 4 knowledge.
    events.publish({
      type: EventType.ResourcesSpent,
      player,
      resources: { knowledge: 4 },
    });

    // 5. Determine if there are any additional one-time bonuses awarded for their new research level.
    const oneTimeBonus = ResearchOneTimeBonuses[area][levelAchieved - 1];
    if (oneTimeBonus) {
      switch (oneTimeBonus.type) {
        case ResearchOneTimeBonusType.FederationToken:
          // TODO: Transfer the Terraforming federation token to the player.
          break;

        case ResearchOneTimeBonusType.Gaiaformer:
          // Award the player one of their Gaiaformers.
          events.publish({
            type: EventType.GaiaformerGained,
            player,
          });
          break;

        case ResearchOneTimeBonusType.LostPlanet:
          // TODO: Player needs to place the Lost Planet on the map. This must be followed up with a "Build a Mine" action.
          break;

        case ResearchOneTimeBonusType.Resources:
          // Player receives a one-time payment of resources.
          bonusResources.push(oneTimeBonus.resources);
          break;

        case ResearchOneTimeBonusType.VictoryPointsForGaiaPlanets:
          // Player receives 4VP + 1VP for each colonized Gaia planet.
          events.publish({
            type: EventType.VPAwarded,
            player,
            vp: this.computeVPForColonizedGaiaPlanets(context.map, player),
            message:
              'VP awarded for mastery of the Gaia Project research track.',
          });
          break;
      }
    }

    if (bonusResources.length) {
      events.publish({
        type: EventType.IncomeGained,
        player,
        income:
          bonusResources.length === 1
            ? bonusResources[0]
            : reduceIncome(...bonusResources),
      });
    }

    // 6. Player advances in selected research area.
    events.publish({
      type: EventType.ResearchCompleted,
      player,
      area,
    });
  }
}
