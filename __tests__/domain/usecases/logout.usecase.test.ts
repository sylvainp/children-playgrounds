import { container } from "tsyringe";
import AppError from "../../../src/common/app_error";
import UsecaseResponse from "../../../src/common/usecase/usecase_response";
import {
  UserRepository,
  UserRepositoryInjectorName,
} from "../../../src/domain/repositories/user.repository";
import SignoutUsecase from "../../../src/domain/usecases/logout/signout.usecase";
import UserRepositoryMock from "../../mocks/classes/user.repository.mock";

describe("Logout", () => {
  let userRepository: UserRepositoryMock;
  let usecase: SignoutUsecase;
  beforeAll(() => {
    userRepository = container.resolve(UserRepositoryInjectorName);
    usecase = new SignoutUsecase(userRepository);
  });

  it("call function must call signout useRepository function", async () => {
    expect.assertions(1);
    jest.spyOn(userRepository, "signout").mockImplementation();
    await usecase.call();
    expect(userRepository.signout).toHaveBeenCalledTimes(1);
  });

  it("call function must return an empty UsecaseResponse if userRepository signout return an empty resolved promise", async () => {
    expect.assertions(2);
    jest.spyOn(userRepository, "signout").mockResolvedValue(undefined);
    const response: UsecaseResponse<void> = await usecase.call();
    expect(response.result).toBeNull();
    expect(response.error).toBeNull();
  });

  it("call function must return an UsecaseResponse with error if userRepository signout return an AppError", async () => {
    expect.assertions(2);
    const expectedError = new AppError("error");
    jest.spyOn(userRepository, "signout").mockResolvedValue(expectedError);
    const response: UsecaseResponse<void> = await usecase.call();
    expect(response.result).toBeNull();
    expect(response.error).toStrictEqual(expectedError);
  });
});
