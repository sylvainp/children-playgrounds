import { container } from "tsyringe";
import AppError from "../../../src/common/app_error";
import UsecaseRequest from "../../../src/common/usecase/usecase_request";
import UsecaseResponse from "../../../src/common/usecase/usecase_response";
import PlaygroundEntity from "../../../src/domain/entities/playground.entity";
import { PlaygroundRepositoryInjectorName } from "../../../src/domain/repositories/playground.repository";
import GetPlaygroundUsecaseRequest from "../../../src/domain/usecases/getPlayground/get_playground.request";
import GetPlaygroundUsecase from "../../../src/domain/usecases/getPlayground/get_playground.usecase";
import PlaygroundRepositoryMock from "../../mocks/classes/playground.repository.mock";

describe("GetPlaygroundUsecase", () => {
  let playgroundRepository: PlaygroundRepositoryMock;
  let usecase: GetPlaygroundUsecase;

  beforeAll(() => {
    playgroundRepository = container.resolve(PlaygroundRepositoryInjectorName);
    usecase = new GetPlaygroundUsecase(playgroundRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("call function must call playgroundRepository", async () => {
    expect.assertions(1);
    jest.spyOn(playgroundRepository, "getPlayground").mockImplementation();
    await usecase.call({ playgroundId: "1" });
    expect(playgroundRepository.getPlayground).toHaveBeenCalledTimes(1);
  });

  it("call function must call playgroundRepository with request param", async () => {
    expect.assertions(2);
    const expectedRequest: GetPlaygroundUsecaseRequest = { playgroundId: "1" };
    jest.spyOn(playgroundRepository, "getPlayground").mockImplementation();
    await usecase.call(expectedRequest);
    expect(playgroundRepository.getPlayground).toHaveBeenCalledTimes(1);
    expect(playgroundRepository.getPlayground).toHaveBeenCalledWith(
      expectedRequest
    );
  });

  it("call function must return UsecaseResponse with playgroundEntity returned by repository", async () => {
    expect.assertions(2);
    const expectedRequest: GetPlaygroundUsecaseRequest = { playgroundId: "1" };
    const expectedPlayground: PlaygroundEntity = new PlaygroundEntity(
      expectedRequest.playgroundId,
      "cityName",
      { latitude: 1, longitude: 2 },
      "2022"
    );
    jest
      .spyOn(playgroundRepository, "getPlayground")
      .mockResolvedValue(expectedPlayground);
    const response: UsecaseResponse<PlaygroundEntity | null | Error> =
      await usecase.call(expectedRequest);
    expect(response.error).toBeNull();
    expect(response.result).toStrictEqual(expectedPlayground);
  });

  it("call function must return UsecaseResponse with Error if returned by repository", async () => {
    expect.assertions(2);
    const expectedRequest: GetPlaygroundUsecaseRequest = { playgroundId: "1" };
    const expectedError: AppError = new AppError("unable to find playground");
    jest
      .spyOn(playgroundRepository, "getPlayground")
      .mockResolvedValue(expectedError);
    const response: UsecaseResponse<PlaygroundEntity | null | Error> =
      await usecase.call(expectedRequest);
    expect(response.result).toBeNull();
    expect(response.error).toStrictEqual(expectedError);
  });
});
