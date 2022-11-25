import TestedPlaygroundEntity from "./testedplayground.entity";

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export default class PlaygroundEntity {
  private _testedPlayground?: TestedPlaygroundEntity[];

  constructor(
    public readonly id: string,
    public readonly cityName: string,
    public readonly coordinate: Coordinate,
    public readonly updateDate: string
  ) {}
}
