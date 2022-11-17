/* eslint-disable import/no-unresolved */
import { AuthError, createClient, SupabaseClient } from "@supabase/supabase-js";
import { inject, injectable } from "tsyringe";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { err } from "react-native-svg/lib/typescript/xml";
import SignupRequest from "../../domain/usecases/signup/signup.request";
import SigninRequest from "../../domain/usecases/signin/signin.request";
import { SupabaseAuthResponse } from "../models/supabase_auth.response";
import { SupabaseGetProfileResponse } from "../models/supabase_getprofile.response";
import { PlaygroundSupabaseModel } from "../models/playground_supabase.model";
import {
  AuthProvider,
  AuthEvent,
} from "../../domain/repositories/auth.provider";

@injectable()
export default class SupabaseDatasource extends AuthProvider {
  static readonly injectorName = "SupabaseDatasource";

  private readonly supabase_url: string;

  private readonly supabaseInstance: SupabaseClient;

  constructor(
    @inject("SUPABASE_PROJECT_ID") supabaseProjectId: string,
    @inject("SUPABASE_ANON_KEY") supabaseAnonKey: string
  ) {
    super();
    this.supabase_url = `https://${supabaseProjectId}.supabase.co`;

    this.supabaseInstance = createClient(this.supabase_url, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
      },
    });
    const { data: authListener } = this.supabaseInstance.auth.onAuthStateChange(
      async (event, session) => {
        switch (event) {
          case "SIGNED_IN":
            this.onSignin(session);
            break;
          case "SIGNED_OUT":
            this.onSignout();
            break;
          case "TOKEN_REFRESHED":
            this.onTokenRefresh(session);
            break;
          default:
        }
      }
    );
  }

  async signup(params: SignupRequest): Promise<void> {
    const { error } = await this.supabaseInstance.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          familyName: params.familyName,
          givenName: params.givenName,
        },
      },
    });
    if (error) {
      return Promise.reject(error);
    }
    return Promise.resolve();
  }

  async signin(params: SigninRequest): Promise<void> {
    const { error } = await this.supabaseInstance.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });
    if (error) {
      return Promise.reject(error);
    }
    return Promise.resolve();
  }

  async getProfile(userid: string): Promise<SupabaseGetProfileResponse | null> {
    const { data, error } = await this.supabaseInstance
      .from("profile")
      .select()
      .eq("auth_user_id", userid);

    if (error) {
      return Promise.reject(error);
    }

    return data.length > 0 ? data[0] : null;
  }

  async getPlaygrounds(): Promise<PlaygroundSupabaseModel[]> {
    const { data, error } = await this.supabaseInstance
      .from("playgrounds")
      .select("*");

    if (error) {
      return Promise.reject(error);
    }

    return Promise.resolve(data);
  }

  async signout(): Promise<void> {
    const { error } = await this.supabaseInstance.auth.signOut();
    if (error) {
      return Promise.reject(error);
    }
    return Promise.resolve();
  }
}
