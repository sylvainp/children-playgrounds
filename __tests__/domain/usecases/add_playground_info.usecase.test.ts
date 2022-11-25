import { container } from "tsyringe";
import AppError from "../../../src/common/app_error";
import UsecaseResponse from "../../../src/common/usecase/usecase_response";
import TestedPlaygroundEntity from "../../../src/domain/entities/testedplayground.entity";
import { PlaygroundRepositoryInjectorName } from "../../../src/domain/repositories/playground.repository";
import AddPlaygroundInfoRequest from "../../../src/domain/usecases/addPlaygroundInfo/add_playground_info.request";
import AddPlaygroundInfoUsecase from "../../../src/domain/usecases/addPlaygroundInfo/add_playground_info.usecase";
import PlaygroundRepositoryMock from "../../mocks/classes/playground.repository.mock";

describe("addPlaygroundInfoUsecase", () => {
  const addInfoRequest: AddPlaygroundInfoRequest = {
    playgroundId: "1",
    userId: "1",
    rate: 3,
    comment: "It's my comment",
    gamesId: [],
  };
  let playgroundRepository: PlaygroundRepositoryMock;
  let usecase: AddPlaygroundInfoUsecase;
  beforeAll(() => {
    playgroundRepository = container.resolve(PlaygroundRepositoryInjectorName);
    usecase = new AddPlaygroundInfoUsecase(playgroundRepository);
  });

  it("call function must call Playground repository", async () => {
    expect.assertions(1);
    jest.spyOn(playgroundRepository, "addInfo").mockImplementation();
    await usecase.call(addInfoRequest);
    expect(playgroundRepository.addInfo).toHaveBeenCalledTimes(1);
  });

  it("call function must pass request argument to repository function", async () => {
    expect.assertions(1);
    jest.spyOn(playgroundRepository, "addInfo").mockImplementation();
    await usecase.call(addInfoRequest);

    expect(playgroundRepository.addInfo).toHaveBeenCalledWith(addInfoRequest);
  });

  it("call function must return UsecaseResponse with error if repository return an error", async () => {
    const expectedError = new AppError("unable to add info");
    expect.assertions(1);
    jest
      .spyOn(playgroundRepository, "addInfo")
      .mockResolvedValue(new AppError("unable to add info"));
    const result: UsecaseResponse<TestedPlaygroundEntity> = await usecase.call(
      addInfoRequest
    );
    expect(result.error).toStrictEqual(expectedError);
  });

  it("call function must return UsecaseResponse with repository result", async () => {
    expect.assertions(1);
    const expectedResult = new TestedPlaygroundEntity("1", "2", 3);
    jest
      .spyOn(playgroundRepository, "addInfo")
      .mockResolvedValue(expectedResult);
    const result = await usecase.call(addInfoRequest);
    expect(result.result).toStrictEqual(expectedResult);
  });
});
