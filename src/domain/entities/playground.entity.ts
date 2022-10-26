export interface Coordinate {
  latitude: string;
  longitude: string;
}

export default class PlaygroundEntity {
  constructor(
    public readonly id: string,
    public readonly cityName: string,
    public readonly coordinate: Coordinate,
    public readonly updatedate: string
  ) {}
}
