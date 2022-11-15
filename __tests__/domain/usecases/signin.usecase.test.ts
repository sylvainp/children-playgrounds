import { container } from "tsyringe";
import AppError from "../../../src/common/app_error";
import { UserRepositoryInjectorName } from "../../../src/domain/repositories/user.repository";
import SigninRequest from "../../../src/domain/usecases/signin/signin.request";
import SigninUsecase from "../../../src/domain/usecases/signin/signin.usecase";
import UserRepositoryMock from "../../mocks/classes/user.repository.mock";

describe("signin", () => {
  let userRepository: UserRepositoryMock;
  let usecase: SigninUsecase;
  const signinRequestMock: SigninRequest = {
    email: "prenom.nom@gmail.com",
    password: "mock_password",
  };
  beforeAll(() => {
    userRepository = container.resolve(UserRepositoryInjectorName);
    usecase = new SigninUsecase(userRepository);
  });

  it("call function must call userRepo signin function with specific parameters", async () => {
    expect.assertions(2);
    jest.spyOn(userRepository, "signin").mockImplementation();
    await usecase.call(signinRequestMock);
    expect(userRepository.signin).toHaveBeenCalledTimes(1);
    expect(userRepository.signin).toHaveBeenCalledWith(signinRequestMock);
  });

  it("call function must return useRespository signin error", async () => {
    expect.assertions(2);
    jest
      .spyOn(userRepository, "signin")
      .mockResolvedValue(new AppError("error"));

    const response = await usecase.call(signinRequestMock);
    expect(response.error instanceof AppError).toBe(true);
    expect(response.error!.message).toStrictEqual("error");
  });
});
