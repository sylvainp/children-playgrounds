/* eslint-disable constructor-super */
import { AuthUser } from "@supabase/supabase-js";
import SupabaseDatasource from "../../../src/data/datasources/supabase.datasource";

export default class SupabaseDatasourceMock extends SupabaseDatasource {
  async signup(params: SignupRequest): Promise<AuthUser | null> {
    return Promise.resolve(null);
  }

  async getProfile(userid: string) {}
}
