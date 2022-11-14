import "reflect-metadata";

import { autoInjectable, inject } from "tsyringe";
import AppError from "../../../common/app_error";
import Usecase from "../../../common/usecase/usecase";
import UsecaseResponse from "../../../common/usecase/usecase_response";
import {
  UserRepository,
  UserRepositoryInjectorName,
} from "../../repositories/user.repository";
import SigninRequest from "./signin.request";

@autoInjectable()
export default class SigninUsecase extends Usecase<SigninRequest, void> {
  constructor(
    @inject(UserRepositoryInjectorName)
    private readonly userRepository: UserRepository
  ) {
    super();
  }

  async call(request: SigninRequest): Promise<UsecaseResponse<void>> {
    const error = await this.userRepository.signin(request);
    if (error instanceof AppError) {
      return UsecaseResponse.fromError(error);
    }
    return UsecaseResponse.fromResult(undefined);
  }
}
