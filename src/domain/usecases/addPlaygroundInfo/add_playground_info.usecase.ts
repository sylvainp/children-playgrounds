import { autoInjectable, inject } from "tsyringe";
import Usecase from "../../../common/usecase/usecase";
import UsecaseResponse from "../../../common/usecase/usecase_response";
import TestedPlaygroundEntity from "../../entities/testedplayground.entity";
import PlaygroundRepository, {
  PlaygroundRepositoryInjectorName,
} from "../../repositories/playground.repository";
import AddPlaygroundInfoRequest from "./add_playground_info.request";

@autoInjectable()
export default class AddPlaygroundInfoUsecase extends Usecase<
  AddPlaygroundInfoRequest,
  TestedPlaygroundEntity
> {
  constructor(
    @inject(PlaygroundRepositoryInjectorName)
    private readonly playgroundRepository: PlaygroundRepository
  ) {
    super();
  }

  async call(
    request: AddPlaygroundInfoRequest
  ): Promise<UsecaseResponse<TestedPlaygroundEntity>> {
    const result = await this.playgroundRepository.addInfo(request);
    if (result instanceof Error) {
      return UsecaseResponse.fromError(result);
    }
    return UsecaseResponse.fromResult(result);
  }
}
