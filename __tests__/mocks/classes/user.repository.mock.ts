/* eslint-disable class-methods-use-this */
import AppError from "../../../src/common/app_error";
import UserEntity from "../../../src/domain/entities/user.entity";
import { UserRepository } from "../../../src/domain/repositories/user.repository";
import signinRequest from "../../../src/domain/usecases/signin/signin.request";
import signupRequest from "../../../src/domain/usecases/signup/signup.request";

export default class UserRepositoryMock implements UserRepository {
  get loggedUser(): UserEntity | null {
    return null;
  }

  async signin(request: signinRequest): Promise<void | AppError> {
    return Promise.resolve();
  }

  async signup(request: signupRequest): Promise<void | AppError> {
    return Promise.resolve();
  }

  async signout(): Promise<void | AppError> {
    return Promise.resolve();
  }
}
