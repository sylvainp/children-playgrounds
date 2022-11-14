/* eslint-disable import/no-unresolved */
import { createClient, SupabaseClient, AuthUser } from "@supabase/supabase-js";
import { injectable } from "tsyringe";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SUPABASE_PROJECT_ID, SUPABASE_ANON_KEY } from "@env";
import SignupRequest from "../../domain/usecases/signup/signup.request";
import SigninRequest from "../../domain/usecases/signin/signin.request";
import { SupabaseAuthResponse } from "../models/supabase_auth.response";
import { SupabaseGetProfileResponse } from "../models/supabase_getprofile.response";

@injectable()
export default class SupabaseDatasource {
  static readonly injectorName = "SupabaseDatasource";

  private readonly supabase_url = `https://${SUPABASE_PROJECT_ID}.supabase.co`;

  private readonly supabaseInstance: SupabaseClient;

  constructor() {
    this.supabaseInstance = createClient(this.supabase_url, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
      },
    });
  }

  async signup(params: SignupRequest): Promise<SupabaseAuthResponse | null> {
    const { data, error } = await this.supabaseInstance.auth.signUp({
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
    return Promise.resolve({
      accessToken: data.session!.access_token,
      email: data.user!.email!,
      id: data.user!.id,
      refreshToken: data.session!.refresh_token,
    });
  }

  async signin(params: SigninRequest): Promise<SupabaseAuthResponse | null> {
    const { data, error } = await this.supabaseInstance.auth.signInWithPassword(
      {
        email: params.email,
        password: params.password,
      }
    );
    if (error) {
      return Promise.reject(error);
    }
    return Promise.resolve({
      accessToken: data.session!.access_token,
      email: data.user!.email!,
      id: data.user!.id,
      refreshToken: data.session!.refresh_token,
    });
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
}
