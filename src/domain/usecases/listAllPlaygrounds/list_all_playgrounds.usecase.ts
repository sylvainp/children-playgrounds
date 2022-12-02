/* eslint-disable no-unused-vars */
import "reflect-metadata";
import { autoInjectable, inject } from "tsyringe";
import Usecase from "../../../common/usecase/usecase";
import UsecaseResponse from "../../../common/usecase/usecase_response";
import Playground from "../../entities/playground.entity";
import PlaygroundRepository, {
  PlaygroundRepositoryInjectorName,
} from "../../repositories/playground.repository";

@autoInjectable()
export default class ListAllPlaygroundsUsecase extends Usecase<
  null,
  Playground[]
> {
  constructor(
    @inject(PlaygroundRepositoryInjectorName)
    private playgroundRepository: PlaygroundRepository
  ) {
    super();
  }

  async call(): Promise<UsecaseResponse<Playground[]>> {
    const result: Playground[] | Error =
      await this.playgroundRepository.getAll();
    if (result instanceof Error) {
      return UsecaseResponse.fromError(result);
    }
    return UsecaseResponse.fromResult(result as Playground[]);
  }
}
