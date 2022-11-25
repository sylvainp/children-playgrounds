import Playground from "../entities/playground.entity";
import TestedPlaygroundEntity from "../entities/testedplayground.entity";

export const PlaygroundRepositoryInjectorName: string = "PlaygroundRepository";
export default interface PlaygroundRepository {
  getAll(): Promise<Playground[] | Error>;
  addInfo(
    request: AddPlaygroundInfoRequest
  ): Promise<TestedPlaygroundEntity | Error>;
}
