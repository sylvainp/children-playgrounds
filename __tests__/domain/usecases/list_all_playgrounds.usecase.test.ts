import { container } from "tsyringe";
import UsecaseResponse from "../../../src/common/usecase/usecase_response";
import PlaygroundEntity from "../../../src/domain/entities/playground.entity";
import { PlaygroundRepositoryInjectorName } from "../../../src/domain/repositories/playground.repository";
import ListAllPlaygroundsUsecase from "../../../src/domain/usecases/listAllPlaygrounds/list_all_playgrounds.usecase";
import PlaygroundRepositoryMock from "../../mocks/classes/playground.repository.mock";

describe("ListAllPlaygroundsUsecase", () => {
  let playgroundRepositoryMock: PlaygroundRepositoryMock;
  let usecase: ListAllPlaygroundsUsecase;
  beforeAll(() => {
    playgroundRepositoryMock = container.resolve(
      PlaygroundRepositoryInjectorName
    );
    usecase = container.resolve(ListAllPlaygroundsUsecase);
  });

  it("usecase must be resolved by DI", () => {
    expect.assertions(1);
    expect(usecase).toBeDefined();
  });

  it("usecase call function must call repository", async () => {
    expect.assertions(1);
    jest.spyOn(playgroundRepositoryMock, "getAll").mockImplementation();
    await usecase.call();
    expect(playgroundRepositoryMock.getAll).toHaveBeenCalledTimes(1);
  });

  it("usecase must return a usecaseresponse with result returned by repositoty no error", async () => {
    expect.assertions(2);
    const expectedresult: PlaygroundEntity[] = [
      new PlaygroundEntity(
        "1",
        "Montpellier",
        { latitude: 1, longitude: 2 },
        "mock_date"
      ),
      new PlaygroundEntity(
        "2",
        "Lattes",
        { latitude: 3, longitude: 3 },
        "mock_date"
      ),
    ];
    jest
      .spyOn(playgroundRepositoryMock, "getAll")
      .mockResolvedValue(expectedresult);
    const usecaseResponse: UsecaseResponse<PlaygroundEntity[]> =
      await usecase.call();
    expect(usecaseResponse.result).toStrictEqual(expectedresult);
    expect(usecaseResponse.error).toBeNull();
  });

  it("usecase must return a usecaseresponse with error returned by repository", async () => {
    expect.assertions(2);
    const expectedError = new Error("internal error");
    jest
      .spyOn(playgroundRepositoryMock, "getAll")
      .mockResolvedValue(expectedError);

    const usecaseResponse: UsecaseResponse<PlaygroundEntity[]> =
      await usecase.call();
    expect(usecaseResponse.result).toBeNull();
    expect(usecaseResponse.error).toStrictEqual(expectedError);
  });
});
