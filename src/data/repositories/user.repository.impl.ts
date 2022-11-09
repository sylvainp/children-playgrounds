import { inject, injectable } from "tsyringe";
import { AuthError } from "@supabase/supabase-js";
import AppError from "../../common/app_error";
import UserEntity from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import signupRequest from "../../domain/usecases/signup/signup.request";
import SupabaseDatasource from "../datasources/supabase.datasource";
import SupabaseAuthError from "../models/supabase_auth.error";

@injectable()
export default class UserRepositoryImpl implements UserRepository {
  private _loggedUser: UserEntity | null = null;

  constructor(
    @inject(SupabaseDatasource.injectorName)
    private readonly supabaseDatasource: SupabaseDatasource
  ) {}

  get loggedUser(): UserEntity | null {
    return this._loggedUser;
  }

  async signup(request: signupRequest): Promise<void | AppError> {
    try {
      const signupResult: {
        email: string;
        accessToken: string;
        refreshToken: string;
        id: string;
      } | null = await this.supabaseDatasource.signup(request);

      if (signupResult == null) {
        return Promise.resolve(new SupabaseAuthError());
      }

      const getProfileResult: {
        given_name: string;
        family_name: string;
      } | null = await this.supabaseDatasource.getProfile(signupResult.id);

      if (getProfileResult == null) {
        return Promise.resolve(new SupabaseAuthError());
      }

      this._loggedUser = new UserEntity(
        signupResult.id,
        signupResult.email,
        getProfileResult.family_name,
        getProfileResult.given_name,
        signupResult.accessToken,
        signupResult.refreshToken
      );
      return Promise.resolve();
    } catch (error) {
      if (error instanceof AuthError) {
        return Promise.resolve(new SupabaseAuthError(error));
      }
      return Promise.resolve(new SupabaseAuthError());
    }
  }
}
