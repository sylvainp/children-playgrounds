/* eslint-disable global-require */
import { container } from "tsyringe";
import { AuthError, Session } from "@supabase/supabase-js";
import SupabaseDatasource from "../../../src/data/datasources/supabase.datasource";
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
    userRepository.reset();
    jest.clearAllMocks();
  });

  const mockSupabaseDatasourceAuthResponse = (): Session => {
    const mocksupabaseResponse = require("../../mocks/datas/supabase_signup_success.json");
    return mocksupabaseResponse.data.session;
    // return {
    //   accessToken: mocksupabaseResponse.data.session!.access_token,
    //   email: mocksupabaseResponse.data.user!.email!,
    //   id: mocksupabaseResponse.data.user!.id,
    //   refreshToken: mocksupabaseResponse.data.session!.refresh_token,
    // };
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
        "Une erreur est survenue. Veuillez ré-essayer plus tard"
      );
    });

    it("must first call signup datasource function and next getProfile with userId", async () => {
      expect.assertions(1);
      jest.spyOn(supabaseDatasource, "signup").mockImplementation(() => {
        supabaseDatasource.onSignin(mockSupabaseDatasourceAuthResponse());
        return Promise.resolve();
      });

      jest.spyOn(supabaseDatasource, "getProfile").mockImplementation();
      await userRepository.signup(expectedSignupRequest);
      expect(supabaseDatasource.getProfile).toHaveBeenCalledWith(
        "f933a47b-ff82-4c94-a58b-f7b3d31de676"
      );
    });

    it("must set loggedUser after requesting supabase datasource", async () => {
      expect.assertions(2);
      const mocksupabaseResponse = require("../../mocks/datas/supabase_signup_success.json");
      jest.spyOn(supabaseDatasource, "signup").mockImplementation(() => {
        supabaseDatasource.onSignin(mockSupabaseDatasourceAuthResponse());
        return Promise.resolve();
      });
      jest.spyOn(supabaseDatasource, "getProfile").mockResolvedValue({
        given_name: expectedSignupRequest.givenName,
        family_name: expectedSignupRequest.familyName,
      });

      expect(userRepository.loggedUser).toBeNull();
      await userRepository.signup(expectedSignupRequest);
      expect(userRepository.loggedUser).toStrictEqual(
        new UserEntity(
          mocksupabaseResponse.data.session.user!.id,
          mocksupabaseResponse.data.session.user!.email!,
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
      const mockSupabaseAuthResponse: Session =
        mockSupabaseDatasourceAuthResponse();
      jest.spyOn(supabaseDatasource, "signin").mockImplementation(() => {
        supabaseDatasource.onSignin(mockSupabaseAuthResponse);
        return Promise.resolve();
      });
      jest
        .spyOn(supabaseDatasource, "getProfile")
        .mockResolvedValue({ given_name: "Bob", family_name: "Morane" });
      await userRepository.signin(expectedSigninRequest);
      expect(supabaseDatasource.getProfile).toHaveBeenCalledWith(
        mockSupabaseAuthResponse.user.id
      );
    });

    it("must set loggedUser after requesting supabase datasource", async () => {
      expect.assertions(2);
      const session: Session = mockSupabaseDatasourceAuthResponse();
      jest.spyOn(supabaseDatasource, "signin").mockImplementation(() => {
        supabaseDatasource.onSignin(session);
        return Promise.resolve();
      });

      jest
        .spyOn(supabaseDatasource, "getProfile")
        .mockResolvedValue(mockSupabaseDatasourceGetProfileResponse);
      expect(userRepository.loggedUser).toBeNull();
      await userRepository.signin(expectedSigninRequest);
      expect(userRepository.loggedUser).toStrictEqual(
        new UserEntity(
          session.user.id,
          session.user.email!,
          mockSupabaseDatasourceGetProfileResponse.family_name,
          mockSupabaseDatasourceGetProfileResponse.given_name,
          session.access_token,
          session.refresh_token
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

  describe("Signout function", () => {
    it("must call supabase datasource signout function", async () => {
      expect.assertions(1);
      jest.spyOn(supabaseDatasource, "signout").mockResolvedValue(undefined);
      await userRepository.signout();
      expect(supabaseDatasource.signout).toHaveBeenCalledTimes(1);
    });

    it("must return an resolved promise with app error if supabase signout function failed", async () => {
      expect.assertions(2);
      jest
        .spyOn(supabaseDatasource, "signout")
        .mockRejectedValue(new AuthError("cannot signout"));

      const result: void | AppError = await userRepository.signout();
      expect(result instanceof SupabaseAuthError).toBe(true);
      expect((result as SupabaseAuthError).message).toStrictEqual(
        "Une erreur est survenue. Veuillez ré-essayer plus tard"
      );
    });

    it("must logout user after signout", async () => {
      const mockSupabaseAuthResponse: SupabaseAuthResponse =
        mockSupabaseDatasourceAuthResponse();
      jest.spyOn(supabaseDatasource, "signin").mockImplementation(() => {
        supabaseDatasource.onSignin(mockSupabaseAuthResponse);
        return Promise.resolve();
      });

      jest
        .spyOn(supabaseDatasource, "getProfile")
        .mockResolvedValue(mockSupabaseDatasourceGetProfileResponse);
      jest.spyOn(supabaseDatasource, "signout").mockImplementation(() => {
        supabaseDatasource.onSignout();
        return Promise.resolve();
      });
      expect(userRepository.loggedUser).toBeNull();
      await userRepository.signin({
        email: "prenom.nom@gmail.com",
        password: "plop",
      });
      expect(userRepository.loggedUser).not.toBeNull();
      await userRepository.signout();
      expect(userRepository.loggedUser).toBeNull();
    });
  });
});
