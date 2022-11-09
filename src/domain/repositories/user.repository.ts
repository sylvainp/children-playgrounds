import AppError from "../../common/app_error";
import SignupRequest from "../usecases/signup/signup.request";

export const UserRepositoryInjectorName: string = "UserRepository";
export interface UserRepository {
  signup(request: SignupRequest): Promise<void | AppError>;
}
