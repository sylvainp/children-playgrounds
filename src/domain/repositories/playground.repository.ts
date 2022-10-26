import Playground from "../entities/playground.entity";

export const PlaygroundRepositoryInjectorName: string = "PlaygroundRepository";
export default interface PlaygroundRepository {
  getAll(): Promise<Playground[] | Error>;
}
