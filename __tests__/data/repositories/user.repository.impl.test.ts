/* eslint-disable global-require */
import { container } from "tsyringe";
import { AuthError } from "@supabase/supabase-js";
import SupabaseDatasource from "../../../src/data/datasources/supabase.datasource";
import UserRepositoryImpl from "../../../src/data/repositories/user.repository.impl";
import SupabaseDatasourceMock from "../../mocks/classes/supabase.datasource.mock";
import SupabaseAuthError from "../../../src/data/models/supabase_auth.error";
import AppError from "../../../src/common/app_error";
import SignupRequest from "../../../src/domain/usecases/signup/signup.request";
import UserEntity from "../../../src/domain/entities/user.entity";

describe("userRepositoryImpl", () => {
  const expectedSignupRequest: SignupRequest = {
    givenName: "Laure",
    familyName: "Tographe",
    email: "laure.tographe@gmail.com",
    password: "plop",
  };
  let supabaseDatasource: SupabaseDatasource;
  let userRepository: UserRepositoryImpl;
  beforeAll(() => {
    supabaseDatasource = container.resolve(SupabaseDatasource.injectorName);
    userRepository = new UserRepositoryImpl(supabaseDatasource);
  });

  it("signup function must call supabaseDatasources signup function and getProfileFromUserId", async () => {
    jest.spyOn(supabaseDatasource, "signup").mockImplementation();
    jest.spyOn(supabaseDatasource, "getProfile").mockImplementation();
    expect.assertions(1);
    await userRepository.signup(expectedSignupRequest);
    expect(supabaseDatasource.signup).toHaveBeenCalledWith(
      expectedSignupRequest
    );
  });

  it("signup function must return SupabaseAuthError from AuthError with correct message", async () => {
    expect.assertions(2);
    jest
      .spyOn(supabaseDatasource, "signup")
      .mockRejectedValue(new AuthError("User already registered"));

    const result: void | AppError = await userRepository.signup(
      expectedSignupRequest
    );
    expect(result instanceof SupabaseAuthError).toBe(true);
    expect((result as SupabaseAuthError).message).toStrictEqual(
      "Un compte avec cette adresse email existe déjà"
    );
  });

  it("signup function must return SupabaseAuthError with default message", async () => {
    expect.assertions(2);
    jest
      .spyOn(supabaseDatasource, "signup")
      .mockRejectedValue(new Error("unknown error"));

    const result: void | AppError = await userRepository.signup(
      expectedSignupRequest
    );
    expect(result instanceof SupabaseAuthError).toBe(true);
    expect((result as SupabaseAuthError).message).toStrictEqual(
      "Impossible de créer le compte. Veuillez ré-essayer plus tard"
    );
  });

  it("signup function must first call signup datasource function and next getProfile with userId", async () => {
    expect.assertions(1);
    const mocksupabaseResponse = require("../../mocks/datas/supabase_signup_success.json");
    jest.spyOn(supabaseDatasource, "signup").mockResolvedValue({
      accessToken: mocksupabaseResponse.data.session!.access_token,
      email: mocksupabaseResponse.data.user!.email!,
      id: mocksupabaseResponse.data.user!.id,
      refreshToken: mocksupabaseResponse.data.session!.refresh_token,
    });

    jest.spyOn(supabaseDatasource, "getProfile").mockImplementation();
    await userRepository.signup(expectedSignupRequest);
    expect(supabaseDatasource.getProfile).toHaveBeenCalledWith(
      "f933a47b-ff82-4c94-a58b-f7b3d31de676"
    );
  });

  it("signup function must set loggedUser after requesting supabase datasource", async () => {
    expect.assertions(2);
    const mocksupabaseResponse = require("../../mocks/datas/supabase_signup_success.json");
    jest.spyOn(supabaseDatasource, "signup").mockResolvedValue({
      accessToken: mocksupabaseResponse.data.session!.access_token,
      email: mocksupabaseResponse.data.user!.email!,
      id: mocksupabaseResponse.data.user!.id,
      refreshToken: mocksupabaseResponse.data.session!.refresh_token,
    });
    jest.spyOn(supabaseDatasource, "getProfile").mockResolvedValue({
      given_name: expectedSignupRequest.givenName,
      family_name: expectedSignupRequest.familyName,
    });

    expect(userRepository.loggedUser).toBeNull();
    await userRepository.signup(expectedSignupRequest);
    expect(userRepository.loggedUser).toStrictEqual(
      new UserEntity(
        mocksupabaseResponse.data.user!.id,
        mocksupabaseResponse.data.user!.email!,
        expectedSignupRequest.familyName,
        expectedSignupRequest.givenName,
        mocksupabaseResponse.data.session!.access_token,
        mocksupabaseResponse.data.session!.refresh_token
      )
    );
  });
});
