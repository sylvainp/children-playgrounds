import { container } from "tsyringe";
import UsecaseResponse from "../../../src/common/usecase/usecase_response";
import PlaygroundEntity from "../../../src/domain/entities/playground.entity";
import { PlaygroundRepositoryInjectorName } from "../../../src/domain/repositories/playground.repository";
import ListAllPlaygroundsUsecase from "../../../src/domain/usecases/list_all_playgrounds.usecase";
import PlaygroundRepositoryMock from "../../mocks/playground.repository.mock";

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
    expect.assertions(1);
    const expectedresult: PlaygroundEntity[] = [
      new PlaygroundEntity(
        "1",
        "Montpellier",
        { latitude: "1", longitude: "2" },
        "mock_date"
      ),
      new PlaygroundEntity(
        "2",
        "Lattes",
        { latitude: "3", longitude: "3" },
        "mock_date"
      ),
    ];
    jest
      .spyOn(playgroundRepositoryMock, "getAll")
      .mockResolvedValue(expectedresult);
    await expect(usecase.call()).resolves.toStrictEqual(
      UsecaseResponse.fromResult(expectedresult)
    );
  });

  it("usecase must return a usecaseresponse with error returned by repository", async () => {
    expect.assertions(1);
    const expectedError = new Error("internal error");
    jest
      .spyOn(playgroundRepositoryMock, "getAll")
      .mockResolvedValue(expectedError);

    await expect(usecase.call()).resolves.toStrictEqual(
      UsecaseResponse.fromError(expectedError)
    );
  });
});
