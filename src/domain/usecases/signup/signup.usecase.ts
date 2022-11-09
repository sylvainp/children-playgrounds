import "reflect-metadata";

import { autoInjectable, inject } from "tsyringe";
import Usecase from "../../../common/usecase/usecase";
import UsecaseResponse from "../../../common/usecase/usecase_response";
import {
  UserRepository,
  UserRepositoryInjectorName,
} from "../../repositories/user.repository";
import SignupRequest from "./signup.request";

@autoInjectable()
export default class SignupUsecase extends Usecase<SignupRequest, void> {
  constructor(
    @inject(UserRepositoryInjectorName)
    private readonly userRepository: UserRepository
  ) {
    super();
  }

  async call(request: SignupRequest): Promise<UsecaseResponse<void>> {
    await this.userRepository.signup(request);
    return UsecaseResponse.fromResult(undefined);
  }
}
