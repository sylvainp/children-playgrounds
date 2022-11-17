/* eslint-disable global-require */
import { container, Lifecycle } from "tsyringe";
import HeraultdataDatasource from "../../../src/data/datasources/heraultdata.datasource";
import PlaygroundHeraultDataModel from "../../../src/data/models/playground_heraultdata.model";
import PlaygroundsRepositoryImpl from "../../../src/data/repositories/playgrounds.repository.impl";
import PlaygroundEntity from "../../../src/domain/entities/playground.entity";
import UserEntity from "../../../src/domain/entities/user.entity";
import PlaygroundRepository, {
  PlaygroundRepositoryInjectorName,
} from "../../../src/domain/repositories/playground.repository";
import {
  UserRepository,
  UserRepositoryInjectorName,
} from "../../../src/domain/repositories/user.repository";
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

  it("getAll function must call heraultdatasource fetchAllRepository function if user not logged", async () => {
    expect.assertions(2);
    jest.spyOn(userRepository, "loggedUser", "get").mockReturnValue(null);
    jest.spyOn(heraultDatasource, "fetchAllPlaygrounds").mockResolvedValue([]);
    jest.spyOn(supabaseDatasource, "getPlaygrounds").mockImplementation();
    await repository.getAll();
    expect(heraultDatasource.fetchAllPlaygrounds).toHaveBeenCalledTimes(1);
    expect(supabaseDatasource.getPlaygrounds).not.toHaveBeenCalled();
  });

  it("getAll function must call supabase fetchAllRepository function if user logged", async () => {
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

  it("getAll must return PlaygroundEntity array built on heraultdatasource response", async () => {
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

  it("getAll must return an error based on heraultdatasource error", async () => {
    expect.assertions(1);
    const expectedError = new Error("server unreachable");
    jest
      .spyOn(heraultDatasource, "fetchAllPlaygrounds")
      .mockRejectedValue(expectedError);
    await expect(repository.getAll()).resolves.toStrictEqual(expectedError);
  });

  it("getAll must return a error based on unexpected error throw by heraultdatasource response", async () => {
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
