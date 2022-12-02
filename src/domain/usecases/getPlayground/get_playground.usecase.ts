/* eslint-disable no-unused-vars */
import "reflect-metadata";
import { autoInjectable, inject } from "tsyringe";
import Usecase from "../../../common/usecase/usecase";
import UsecaseResponse from "../../../common/usecase/usecase_response";
import PlaygroundEntity from "../../entities/playground.entity";
import PlaygroundRepository, {
  PlaygroundRepositoryInjectorName,
} from "../../repositories/playground.repository";
import GetPlaygroundUsecaseRequest from "./get_playground.request";

@autoInjectable()
export default class GetPlaygroundUsecase extends Usecase<
  GetPlaygroundUsecaseRequest,
  PlaygroundEntity | null
> {
  constructor(
    @inject(PlaygroundRepositoryInjectorName)
    private repository: PlaygroundRepository
  ) {
    super();
  }

  async call(
    request: GetPlaygroundUsecaseRequest
  ): Promise<UsecaseResponse<PlaygroundEntity | null>> {
    const response: PlaygroundEntity | null | Error =
      await this.repository.getPlayground(request);

    if (response instanceof Error) {
      return UsecaseResponse.fromError(response);
    }

    return UsecaseResponse.fromResult(response);
  }
}
