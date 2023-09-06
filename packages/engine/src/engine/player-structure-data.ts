import { MapHex, PlayerStructureData } from '../interfaces';

export class PlayerStructureDataInstance implements PlayerStructureData {
  private max: number;
  private _locations: MapHex[];

  constructor(maxAvailable: number) {
    if (maxAvailable < 0) {
      throw new Error('Maximum cannot be less than zero.');
    }

    this.max = maxAvailable;
    this._locations = [];
  }

  get available(): number {
    return this.max - this.locations.length;
  }

  get locations(): Readonly<MapHex[]> {
    return this._locations;
  }

  setMax(max: number): void {
    if (max < 0) {
      throw new Error('Maximum cannot be less than zero.');
    }

    this.max = max;
  }

  place(location: MapHex): void {
    if (this.available < 1) {
      // TODO: Error
    }

    this._locations.push(location);
  }

  remove(location: MapHex): void {
    throw new Error('Method not implemented.');
  }
}
