import { PlanetType } from '..';

const EmptyTile: Record<string, PlanetType | null> = {
  '0,0': null,
  '-1,1': null,
  '0,1': null,
  '1,0': null,
  '1,-1': null,
  '0,-1': null,
  '-1,0': null,
  '-2,2': null,
  '-1,2': null,
  '0,2': null,
  '1,1': null,
  '2,0': null,
  '2,-1': null,
  '2,-2': null,
  '1,-2': null,
  '0,-2': null,
  '-1,-1': null,
  '-2,0': null,
  '-2,1': null,
};

export const MapTileData: ReadonlyArray<Record<string, PlanetType | null>> = [
  {
    ...EmptyTile,
    '1,-1': PlanetType.Terra,
    '-1,0': PlanetType.Swamp,
    '0,2': PlanetType.Oxide,
    '1,1': PlanetType.Volcanic,
    '2,-1': PlanetType.Transdim,
    '-2,1': PlanetType.Desert,
  } as const,

  {
    ...EmptyTile,
    '-1,1': PlanetType.Swamp,
    '1,-1': PlanetType.Ice,
    '-1,2': PlanetType.Oxide,
    '1,1': PlanetType.Transdim,
    '2,-1': PlanetType.Desert,
    '0,-2': PlanetType.Titanium,
    '-1,-1': PlanetType.Volcanic,
  } as const,

  {
    ...EmptyTile,
    '1,0': PlanetType.Ice,
    '-1,0': PlanetType.Gaia,
    '-1,2': PlanetType.Terra,
    '0,2': PlanetType.Desert,
    '2,-1': PlanetType.Titanium,
    '0,-2': PlanetType.Transdim,
  } as const,

  {
    ...EmptyTile,
    '-1,1': PlanetType.Volcanic,
    '1,0': PlanetType.Swamp,
    '0,-1': PlanetType.Oxide,
    '2,0': PlanetType.Terra,
    '0,-2': PlanetType.Titanium,
    '-2,1': PlanetType.Ice,
  } as const,

  {
    ...EmptyTile,
    '-1,0': PlanetType.Gaia,
    '-1,2': PlanetType.Volcanic,
    '0,2': PlanetType.Desert,
    '2,-1': PlanetType.Oxide,
    '2,-2': PlanetType.Transdim,
    '0,-2': PlanetType.Ice,
  } as const,

  {
    ...EmptyTile,
    '0,1': PlanetType.Gaia,
    '1,-1': PlanetType.Terra,
    '-1,0': PlanetType.Swamp,
    '1,1': PlanetType.Transdim,
    '2,0': PlanetType.Desert,
    '1,-2': PlanetType.Transdim,
  } as const,

  {
    ...EmptyTile,
    '-1,1': PlanetType.Gaia,
    '1,0': PlanetType.Gaia,
    '0,-1': PlanetType.Volcanic,
    '0,2': PlanetType.Titanium,
    '1,-2': PlanetType.Swamp,
    '-2,0': PlanetType.Transdim,
  } as const,

  {
    ...EmptyTile,
    '-1,1': PlanetType.Volcanic,
    '1,0': PlanetType.Titanium,
    '0,-1': PlanetType.Ice,
    '-1,2': PlanetType.Transdim,
    '2,-2': PlanetType.Transdim,
    '0,-2': PlanetType.Terra,
  } as const,

  {
    ...EmptyTile,
    '-1,1': PlanetType.Titanium,
    '1,0': PlanetType.Gaia,
    '-2,2': PlanetType.Swamp,
    '2,-2': PlanetType.Ice,
    '1,-2': PlanetType.Transdim,
    '-1,-1': PlanetType.Volcanic,
  } as const,

  {
    ...EmptyTile,
    '1,0': PlanetType.Gaia,
    '-1,0': PlanetType.Desert,
    '-2,2': PlanetType.Terra,
    '-1,2': PlanetType.Oxide,
    '2,-2': PlanetType.Transdim,
    '1,-2': PlanetType.Transdim,
  } as const,

  {
    ...EmptyTile,
    '-1,0': PlanetType.Gaia,
    '-1,2': PlanetType.Volcanic,
    '2,-1': PlanetType.Oxide,
    '2,-2': PlanetType.Transdim,
    '0,-2': PlanetType.Ice,
  } as const,

  {
    ...EmptyTile,
    '0,1': PlanetType.Gaia,
    '1,-1': PlanetType.Terra,
    '1,1': PlanetType.Transdim,
    '2,0': PlanetType.Desert,
    '1,-2': PlanetType.Transdim,
  } as const,

  {
    ...EmptyTile,
    '-1,1': PlanetType.Gaia,
    '1,0': PlanetType.Swamp,
    '0,-1': PlanetType.Gaia,
    '0,2': PlanetType.Titanium,
    '-2,0': PlanetType.Transdim,
  } as const,
];
