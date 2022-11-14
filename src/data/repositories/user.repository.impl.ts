import { inject, injectable } from "tsyringe";
import { AuthError } from "@supabase/supabase-js";
import AppError from "../../common/app_error";
import UserEntity from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import signupRequest from "../../domain/usecases/signup/signup.request";
import SupabaseDatasource from "../datasources/supabase.datasource";
import SupabaseAuthError from "../models/supabase_auth.error";
import signinRequest from "../../domain/usecases/signin/signin.request";
import { SupabaseAuthResponse } from "../models/supabase_auth.response";
import { SupabaseGetProfileResponse } from "../models/supabase_getprofile.response";

@injectable()
export default class UserRepositoryImpl implements UserRepository {
  protected _loggedUser: UserEntity | null = null;

  constructor(
    @inject(SupabaseDatasource.injectorName)
    private readonly supabaseDatasource: SupabaseDatasource
  ) {}

  get loggedUser(): UserEntity | null {
    return this._loggedUser;
  }

  async signup(request: signupRequest): Promise<void | AppError> {
    try {
      const signupResult: SupabaseAuthResponse | null =
        await this.supabaseDatasource.signup(request);

      if (signupResult == null) {
        return Promise.resolve(new SupabaseAuthError());
      }

      const getProfileResult: SupabaseGetProfileResponse | null =
        await this.supabaseDatasource.getProfile(signupResult.id);

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

  async signin(request: signinRequest): Promise<void | AppError> {
    try {
      const signinResult: SupabaseAuthResponse | null =
        await this.supabaseDatasource.signin(request);

      if (signinResult == null) {
        return Promise.resolve(new SupabaseAuthError());
      }
      const getProfileResult: SupabaseGetProfileResponse | null =
        await this.supabaseDatasource.getProfile(signinResult!.id);

      if (getProfileResult == null) {
        return Promise.resolve(new SupabaseAuthError());
      }

      this._loggedUser = new UserEntity(
        signinResult.id,
        signinResult.email,
        getProfileResult.family_name,
        getProfileResult.given_name,
        signinResult.accessToken,
        signinResult.refreshToken
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
