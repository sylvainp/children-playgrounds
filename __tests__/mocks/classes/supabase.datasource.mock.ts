/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable constructor-super */
import SupabaseDatasource from "../../../src/data/datasources/supabase.datasource";
import { SupabaseAuthResponse } from "../../../src/data/models/supabase_auth.response";
import { SupabaseGetProfileResponse } from "../../../src/data/models/supabase_getprofile.response";
import SigninRequest from "../../../src/domain/usecases/signin/signin.request";
import SignupRequest from "../../../src/domain/usecases/signup/signup.request";

export default class SupabaseDatasourceMock extends SupabaseDatasource {
  constructor() {
    super("", "");
  }

  async signup(params: SignupRequest): Promise<void> {
    return Promise.resolve();
  }

  async signin(params: SigninRequest): Promise<void> {
    return Promise.resolve();
  }

  async getProfile(userid: string): Promise<SupabaseGetProfileResponse | null> {
    return Promise.resolve(null);
  }
}
