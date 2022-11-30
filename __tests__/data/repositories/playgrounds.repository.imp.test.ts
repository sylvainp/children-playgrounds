/* eslint-disable global-require */
import { container, Lifecycle } from "tsyringe";
import HeraultdataDatasource from "../../../src/data/datasources/heraultdata.datasource";
import PlaygroundHeraultDataModel from "../../../src/data/models/playground_heraultdata.model";
import { PlaygroundSupabaseModel } from "../../../src/data/models/playground_supabase.model";
import PlaygroundsRepositoryImpl from "../../../src/data/repositories/playgrounds.repository.impl";
import PlaygroundEntity from "../../../src/domain/entities/playground.entity";
import UserEntity from "../../../src/domain/entities/user.entity";
import PlaygroundRepository, {
  PlaygroundRepositoryInjectorName,
} from "../../../src/domain/repositories/playground.repository";
import { UserRepositoryInjectorName } from "../../../src/domain/repositories/user.repository";
import AddPlaygroundInfoRequest from "../../../src/domain/usecases/addPlaygroundInfo/add_playground_info.request";
import GetPlaygroundUsecaseRequest from "../../../src/domain/usecases/getPlayground/get_playground.request";
import HeraultdataDatasourceMock from "../../mocks/classes/heraultdata.datasource.mock";
import SupabaseDatasourceMock from "../../mocks/classes/supabase.datasource.mock";
import UserRepositoryMock from "../../mocks/classes/user.repository.mock";

describe("PlaygroundsRepositoryImpl", () => {
  let repository: PlaygroundRepository;
  let heraultDatasource: HeraultdataDatasourceMock;
  let supabaseDatasource: SupabaseDatasourceMock;
  let userRepository: UserRepositoryMock;
  const mockedUserEntity = new UserEntity(
    "1",
    "toto@tata.com",
    "toto",
    "tata",
    "XXXX-XXX",
    "YYYY-YYY"
  );
  beforeAll(() => {
    container.register(
      PlaygroundRepositoryInjectorName,
      { useClass: PlaygroundsRepositoryImpl },
      { lifecycle: Lifecycle.Singleton }
    );
    userRepository = container.resolve(UserRepositoryInjectorName);
    supabaseDatasource = container.resolve(SupabaseDatasourceMock.injectorName);
    heraultDatasource = container.resolve(HeraultdataDatasource.injectorName);
    repository = container.resolve(PlaygroundRepositoryInjectorName);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("repository must be resolved by DI", async () => {
    expect.assertions(2);
    expect(repository).toBeDefined();
    expect(repository instanceof PlaygroundsRepositoryImpl).toBe(true);
  });

  describe("getAll function", () => {
    it("must call heraultdatasource fetchAllRepository function if user not logged", async () => {
      expect.assertions(2);
      jest.spyOn(userRepository, "loggedUser", "get").mockReturnValue(null);
      jest
        .spyOn(heraultDatasource, "fetchAllPlaygrounds")
        .mockResolvedValue([]);
      jest.spyOn(supabaseDatasource, "getPlaygrounds").mockImplementation();
      await repository.getAll();
      expect(heraultDatasource.fetchAllPlaygrounds).toHaveBeenCalledTimes(1);
      expect(supabaseDatasource.getPlaygrounds).not.toHaveBeenCalled();
    });

    it("must call supabase fetchAllRepository function if user logged", async () => {
      expect.assertions(2);
      jest
        .spyOn(userRepository, "loggedUser", "get")
        .mockReturnValue(mockedUserEntity);
      jest.spyOn(heraultDatasource, "fetchAllPlaygrounds").mockImplementation();
      jest.spyOn(supabaseDatasource, "getPlaygrounds").mockResolvedValue([]);
      await repository.getAll();
      expect(heraultDatasource.fetchAllPlaygrounds).not.toHaveBeenCalled();
      expect(supabaseDatasource.getPlaygrounds).toHaveBeenCalledTimes(1);
    });

    it("must return PlaygroundEntity array built on heraultdatasource response", async () => {
      expect.assertions(1);
      const mockReturnedValue: PlaygroundHeraultDataModel[] =
        require("../../mocks/datas/herault_data_playgrounds.json") as PlaygroundHeraultDataModel[];

      jest
        .spyOn(heraultDatasource, "fetchAllPlaygrounds")
        .mockResolvedValue(mockReturnedValue);
      await expect(repository.getAll()).resolves.toStrictEqual(
        mockReturnedValue.map(
          (item) =>
            new PlaygroundEntity(
              item.recordid,
              item.fields.com_nom,
              {
                latitude: item.geometry.coordinates[1],
                longitude: item.geometry.coordinates[0],
              },
              item.record_timestamp
            )
        )
      );
    });

    it("must return an error based on heraultdatasource error", async () => {
      expect.assertions(1);
      const expectedError = new Error("server unreachable");
      jest
        .spyOn(heraultDatasource, "fetchAllPlaygrounds")
        .mockRejectedValue(expectedError);
      await expect(repository.getAll()).resolves.toStrictEqual(expectedError);
    });

    it("must return a error based on unexpected error throw by heraultdatasource response", async () => {
      expect.assertions(1);
      const expectedError = { error: { message: ["server unreachable"] } };
      jest
        .spyOn(heraultDatasource, "fetchAllPlaygrounds")
        .mockRejectedValue(expectedError);
      await expect(repository.getAll()).resolves.toStrictEqual(
        new Error(JSON.stringify(expectedError))
      );
    });
  });
  describe("addInfo function", () => {
    const addInfoRequest: AddPlaygroundInfoRequest = {
      playgroundId: "1",
      userId: "1",
      rate: 3,
      comment: "It's my comment",
      gamesId: [],
    };

    it("must call supabase datasource with add info request", async () => {
      expect.assertions(2);
      jest
        .spyOn(supabaseDatasource, "addPlaygroundInfo")
        .mockResolvedValue(undefined);
      await repository.addInfo(addInfoRequest);
      expect(supabaseDatasource.addPlaygroundInfo).toHaveBeenCalledTimes(1);
      expect(supabaseDatasource.addPlaygroundInfo).toHaveBeenCalledWith(
        addInfoRequest
      );
    });
  });

  describe("getPlayground function", () => {
    const expectedGetPlaygroundRequest: GetPlaygroundUsecaseRequest = {
      playgroundId: "1",
    };
    it("must call supabase datasource", async () => {
      expect.assertions(1);
      jest.spyOn(supabaseDatasource, "getPlayground").mockImplementation();
      await repository.getPlayground(expectedGetPlaygroundRequest);
      expect(supabaseDatasource.getPlayground).toHaveBeenCalledTimes(1);
    });

    it("must return PlaygroundEntity build from PlaygroundSupabaseModel datasource result", async () => {
      expect.assertions(2);
      const expectedPlaygroundModel: PlaygroundSupabaseModel = {
        coordinate: { latitude: 1, longitude: 2 },
        cityName: "cityName",
        id: expectedGetPlaygroundRequest.playgroundId,
        updateDate: "2022",
      };
      jest
        .spyOn(supabaseDatasource, "getPlayground")
        .mockResolvedValue(expectedPlaygroundModel);
      const result: PlaygroundEntity | Error | null =
        await repository.getPlayground(expectedGetPlaygroundRequest);
      expect(result instanceof PlaygroundEntity).toBe(true);
      expect(result).toStrictEqual(
        new PlaygroundEntity(
          expectedPlaygroundModel.id,
          expectedPlaygroundModel.cityName,
          expectedPlaygroundModel.coordinate,
          expectedPlaygroundModel.updateDate,
          undefined
        )
      );
    });

    it("must return error returned by supabase datasource", async () => {
      expect.assertions(2);
      const expectedError = new Error("unabled to find playground");
      jest
        .spyOn(supabaseDatasource, "getPlayground")
        .mockRejectedValue(expectedError);
      const result: PlaygroundEntity | Error | null =
        await repository.getPlayground(expectedGetPlaygroundRequest);
      expect(result instanceof Error).toBe(true);
      expect(result).toStrictEqual(expectedError);
    });

    it("must return null if supabase no return data", async () => {
      expect.assertions(1);
      jest.spyOn(supabaseDatasource, "getPlayground").mockResolvedValue(null);
      const result: PlaygroundEntity | Error | null =
        await repository.getPlayground(expectedGetPlaygroundRequest);
      expect(result).toBeNull();
    });
  });
});
