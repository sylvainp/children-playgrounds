import PlaygroundEntity from "../entities/playground.entity";
import TestedPlaygroundEntity from "../entities/testedplayground.entity";
import AddPlaygroundInfoRequest from "../usecases/addPlaygroundInfo/add_playground_info.request";
import GetPlaygroundUsecaseRequest from "../usecases/getPlayground/get_playground.request";

export const PlaygroundRepositoryInjectorName: string = "PlaygroundRepository";
export default interface PlaygroundRepository {
  getAll(): Promise<PlaygroundEntity[] | Error>;
  addInfo(
    request: AddPlaygroundInfoRequest
  ): Promise<TestedPlaygroundEntity | Error>;
  getPlayground(
    request: GetPlaygroundUsecaseRequest
  ): Promise<PlaygroundEntity | null | Error>;
}
