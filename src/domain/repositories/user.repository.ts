import AppError from "../../common/app_error";
import SigninRequest from "../usecases/signin/signin.request";
import SignupRequest from "../usecases/signup/signup.request";

export const UserRepositoryInjectorName: string = "UserRepository";
export interface UserRepository {
  signup(request: SignupRequest): Promise<void | AppError>;
  signin(request: SigninRequest): Promise<void | AppError>;
  signout(): Promise<void | AppError>;
}
