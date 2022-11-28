import TestedPlaygroundEntity from "./testedplayground.entity";

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export default class PlaygroundEntity {
  constructor(
    public readonly id: string,
    public readonly cityName: string,
    public readonly coordinate: Coordinate,
    public readonly updateDate: string,
    public readonly testedPlayground?: TestedPlaygroundEntity[]
  ) {}

  isVisitedPlaygroundForUserId(userid: string): boolean {
    return this.testedPlayground
      ? this.testedPlayground!.filter((item) => {
          console.log(`compare ${item.userId} with ${userid}`);
          return item.userId === userid;
        }).length > 0
      : false;
  }
}
