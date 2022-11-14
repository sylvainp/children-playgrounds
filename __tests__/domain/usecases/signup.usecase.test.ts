import { container } from "tsyringe";
import {
  UserRepository,
  UserRepositoryInjectorName,
} from "../../../src/domain/repositories/user.repository";
import SignupRequest from "../../../src/domain/usecases/signup/signup.request";
import SignupUsecase from "../../../src/domain/usecases/signup/signup.usecase";

describe("signup", () => {
  let userRepository: UserRepository;
  let usecase: SignupUsecase;
  const expectedSignupRequest: SignupRequest = {
    givenName: "Laure",
    familyName: "Tographe",
    email: "laure.tographe@gmail.com",
    password: "plop",
  };
  beforeAll(() => {
    userRepository = container.resolve(UserRepositoryInjectorName);
    usecase = new SignupUsecase(userRepository);
  });

  it("call function must call userRepository signup function", async () => {
    expect.assertions(2);

    jest.spyOn(userRepository, "signup").mockImplementation();
    await usecase.call(expectedSignupRequest);
    expect(userRepository.signup).toHaveBeenCalledTimes(1);
    expect(userRepository.signup).toHaveBeenCalledWith(expectedSignupRequest);
  });

  it("call function must return userRepo error", async () => {
    expect.assertions(1);
    const expectedError = new Error("wrong password");
    jest.spyOn(userRepository, "signup").mockRejectedValue(expectedError);
    await expect(usecase.call(expectedSignupRequest)).rejects.toStrictEqual(
      expectedError
    );
  });
});
