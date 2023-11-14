import { AxialCoordinates, PlayerStructureData } from '../interfaces';

const InvalidMaximumError = new Error('Maximum cannot be less than zero.');

export class PlayerStructureManager implements PlayerStructureData {
  private max: number;
  private _locations: AxialCoordinates[];

  constructor(maxAvailable: number) {
    if (maxAvailable < 0) {
      throw InvalidMaximumError;
    }

    this.max = maxAvailable;
    this._locations = [];
  }

  get available(): number {
    return this.max - this.locations.length;
  }

  get active(): number {
    return this.locations.length;
  }

  get locations(): AxialCoordinates[] {
    return [...this._locations];
  }

  setMax(max: number): void {
    if (max < 0) {
      throw InvalidMaximumError;
    }

    this.max = max;
  }

  place(location: AxialCoordinates): void {
    if (this.available < 1) {
      throw new Error(
        'Unable to place structure. Player does not have one available.',
      );
    }
    this._locations.push(location);
  }

  remove(location: AxialCoordinates): void {
    const index = this._locations.findIndex((loc) => location === loc);
    if (index > -1) {
      this._locations.splice(index, 1);
    }
  }
}
