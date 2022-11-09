/* eslint-disable class-methods-use-this */
import UserRepository from "../../../src/domain/repositories/user.repository";
import signupRequest from "../../../src/domain/usecases/signup/signup.request";

export default class UserRepositoryMock implements UserRepository {
  async signup(request: signupRequest): Promise<void> {
    return Promise.resolve();
  }
}
