/* eslint-disable global-require */
import { container } from "tsyringe";
import { AuthError } from "@supabase/supabase-js";
import SupabaseDatasource from "../../../src/data/datasources/supabase.datasource";
import UserRepositoryImpl from "../../../src/data/repositories/user.repository.impl";
import SupabaseAuthError from "../../../src/data/models/supabase_auth.error";
import AppError from "../../../src/common/app_error";
import SignupRequest from "../../../src/domain/usecases/signup/signup.request";
import UserEntity from "../../../src/domain/entities/user.entity";
import SigninRequest from "../../../src/domain/usecases/signin/signin.request";
import { SupabaseAuthResponse } from "../../../src/data/models/supabase_auth.response";
import UserRepositoryImplMock from "../../mocks/classes/user.respository.impl.mock";

describe("userRepositoryImpl", () => {
  let supabaseDatasource: SupabaseDatasource;
  let userRepository: UserRepositoryImplMock;
  beforeAll(() => {
    supabaseDatasource = container.resolve(SupabaseDatasource.injectorName);
    userRepository = new UserRepositoryImplMock(supabaseDatasource);
  });

  afterEach(() => {
    jest.clearAllMocks();
    userRepository.reset();
  });

  const mockSupabaseDatasourceAuthResponse = (): SupabaseAuthResponse => {
    const mocksupabaseResponse = require("../../mocks/datas/supabase_signup_success.json");
    return {
      accessToken: mocksupabaseResponse.data.session!.access_token,
      email: mocksupabaseResponse.data.user!.email!,
      id: mocksupabaseResponse.data.user!.id,
      refreshToken: mocksupabaseResponse.data.session!.refresh_token,
    };
  };

  const mockSupabaseDatasourceGetProfileResponse = {
    given_name: "Bob",
    family_name: "Morane",
  };

  describe("Signup function", () => {
    const expectedSignupRequest: SignupRequest = {
      givenName: "Laure",
      familyName: "Tographe",
      email: "laure.tographe@gmail.com",
      password: "plop",
    };

    it("must call supabaseDatasources signup function and getProfileFromUserId", async () => {
      jest.spyOn(supabaseDatasource, "signup").mockImplementation();
      jest.spyOn(supabaseDatasource, "getProfile").mockImplementation();
      expect.assertions(1);
      await userRepository.signup(expectedSignupRequest);
      expect(supabaseDatasource.signup).toHaveBeenCalledWith(
        expectedSignupRequest
      );
    });

    it("must return SupabaseAuthError from AuthError with correct message", async () => {
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

    it("must return SupabaseAuthError with default message", async () => {
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

    it("must first call signup datasource function and next getProfile with userId", async () => {
      expect.assertions(1);
      jest
        .spyOn(supabaseDatasource, "signup")
        .mockResolvedValue(mockSupabaseDatasourceAuthResponse());

      jest.spyOn(supabaseDatasource, "getProfile").mockImplementation();
      await userRepository.signup(expectedSignupRequest);
      expect(supabaseDatasource.getProfile).toHaveBeenCalledWith(
        "f933a47b-ff82-4c94-a58b-f7b3d31de676"
      );
    });

    it("must set loggedUser after requesting supabase datasource", async () => {
      expect.assertions(2);
      const mocksupabaseResponse = require("../../mocks/datas/supabase_signup_success.json");
      jest
        .spyOn(supabaseDatasource, "signup")
        .mockResolvedValue(mockSupabaseDatasourceAuthResponse());
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

  describe("Signin function", () => {
    const expectedSigninRequest: SigninRequest = {
      email: "prenom.nom@gmail.com",
      password: "plop",
    };

    it("must call supabase signin function with parameters", async () => {
      expect.assertions(2);
      jest.spyOn(supabaseDatasource, "signin").mockImplementation();
      await userRepository.signin(expectedSigninRequest);
      expect(supabaseDatasource.signin).toHaveBeenCalledTimes(1);
      expect(supabaseDatasource.signin).toHaveBeenCalledWith(
        expectedSigninRequest
      );
    });

    it("must call supabase getProfile function with supabase signin response", async () => {
      expect.assertions(1);
      const mockSupabaseAuthResponse: SupabaseAuthResponse =
        mockSupabaseDatasourceAuthResponse();
      jest
        .spyOn(supabaseDatasource, "signin")
        .mockResolvedValue(mockSupabaseAuthResponse);
      jest
        .spyOn(supabaseDatasource, "getProfile")
        .mockResolvedValue({ given_name: "Bob", family_name: "Morane" });
      await userRepository.signin(expectedSigninRequest);
      expect(supabaseDatasource.getProfile).toHaveBeenCalledWith(
        mockSupabaseAuthResponse.id
      );
    });

    it("must set loggedUser after requesting supabase datasource", async () => {
      expect.assertions(2);
      const mockSupabaseAuthResponse: SupabaseAuthResponse =
        mockSupabaseDatasourceAuthResponse();

      jest
        .spyOn(supabaseDatasource, "signin")
        .mockResolvedValue(mockSupabaseAuthResponse);
      jest
        .spyOn(supabaseDatasource, "getProfile")
        .mockResolvedValue(mockSupabaseDatasourceGetProfileResponse);
      expect(userRepository.loggedUser).toBeNull();
      await userRepository.signin(expectedSigninRequest);
      expect(userRepository.loggedUser).toStrictEqual(
        new UserEntity(
          mockSupabaseAuthResponse.id,
          mockSupabaseAuthResponse.email,
          mockSupabaseDatasourceGetProfileResponse.family_name,
          mockSupabaseDatasourceGetProfileResponse.given_name,
          mockSupabaseAuthResponse.accessToken,
          mockSupabaseAuthResponse.refreshToken
        )
      );
    });

    it("must resolve an error if signin supabase datasource throw an error", async () => {
      expect.assertions(2);
      jest
        .spyOn(supabaseDatasource, "signin")
        .mockRejectedValue(new AuthError("Invalid login credentials"));

      const result = await userRepository.signin(expectedSigninRequest);
      expect(result instanceof AppError).toBe(true);
      expect((result as AppError).message).toStrictEqual(
        "Vos identifiants sont incorrects"
      );
    });
  });
});
