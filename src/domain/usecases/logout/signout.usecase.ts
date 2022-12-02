import "reflect-metadata";
import { autoInjectable, inject } from "tsyringe";
import AppError from "../../../common/app_error";
import Usecase from "../../../common/usecase/usecase";
import UsecaseResponse from "../../../common/usecase/usecase_response";
import {
  UserRepository,
  UserRepositoryInjectorName,
} from "../../repositories/user.repository";

@autoInjectable()
export default class SignoutUsecase extends Usecase<null, void> {
  constructor(
    @inject(UserRepositoryInjectorName)
    private readonly userRepository: UserRepository
  ) {
    super();
  }

  async call(): Promise<UsecaseResponse<void>> {
    const response: void | AppError = await this.userRepository.signout();
    if (response instanceof AppError) {
      return UsecaseResponse.fromError(response);
    }

    return UsecaseResponse.fromResult(null);
  }
}
