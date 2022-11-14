import UserRepositoryImpl from "../../../src/data/repositories/user.repository.impl";

export default class UserRepositoryImplMock extends UserRepositoryImpl {
  reset() {
    this._loggedUser = null;
  }
}
