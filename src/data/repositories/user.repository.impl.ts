import { inject, injectable } from "tsyringe";
import { AuthError, Session } from "@supabase/supabase-js";
import AppError from "../../common/app_error";
import UserEntity from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import signupRequest from "../../domain/usecases/signup/signup.request";
import SupabaseDatasource from "../datasources/supabase.datasource";
import SupabaseAuthError from "../models/supabase_auth.error";
import signinRequest from "../../domain/usecases/signin/signin.request";
import { SupabaseAuthResponse } from "../models/supabase_auth.response";
import { SupabaseGetProfileResponse } from "../models/supabase_getprofile.response";
import { store } from "../../common/redux/store";
import { registerUser } from "../../common/redux/logged_user";
import { AuthEvent } from "../../domain/repositories/auth.provider";

@injectable()
export default class UserRepositoryImpl implements UserRepository {
  protected _loggedUser: UserEntity | null = null;

  constructor(
    @inject(SupabaseDatasource.injectorName)
    private readonly supabaseDatasource: SupabaseDatasource
  ) {
    this.supabaseDatasource.onAuthChange$.subscribe(async (event) => {
      if (event.type === AuthEvent.SIGN_OUT) {
        this.loggedUser = null;
      } else if (event.type === AuthEvent.SIGN_IN) {
        const session: Session = event.data;

        const getProfileResult: SupabaseGetProfileResponse | null =
          await this.supabaseDatasource.getProfile(session.user!.id);

        if (getProfileResult) {
          this.loggedUser = new UserEntity(
            session.user!.id,
            session.user!.email!,
            getProfileResult.family_name,
            getProfileResult.given_name,
            session.access_token,
            session.refresh_token
          );
        }
      }
    });
  }

  get loggedUser(): UserEntity | null {
    return this._loggedUser;
  }

  private set loggedUser(user: UserEntity | null) {
    this._loggedUser = user;
    store.dispatch(
      registerUser(
        user
          ? {
              id: user.id,
              email: user.email,
              familyName: user.familyName,
              givenName: user.givenName,
              accessToken: user.accessToken,
              refreshToken: user.refreshToken,
            }
          : null
      )
    );
  }

  async signup(request: signupRequest): Promise<void | AppError> {
    try {
      await this.supabaseDatasource.signup(request);
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
      await this.supabaseDatasource.signin(request);
      return Promise.resolve();
    } catch (error) {
      if (error instanceof AuthError) {
        return Promise.resolve(new SupabaseAuthError(error));
      }
      return Promise.resolve(new SupabaseAuthError());
    }
  }

  async signout(): Promise<void | AppError> {
    try {
      await this.supabaseDatasource.signout();
      this.loggedUser = null;
    } catch (error) {
      if (error instanceof AuthError) {
        return Promise.resolve(new SupabaseAuthError(error));
      }

      return Promise.resolve(new SupabaseAuthError());
    }

    return Promise.resolve();
  }
}
