export interface Coordinate {
  latitude: number;
  longitude: number;
}

export default class PlaygroundEntity {
  constructor(
    public readonly id: string,
    public readonly cityName: string,
    public readonly coordinate: Coordinate,
    public readonly updateDate: string
  ) {}
}
