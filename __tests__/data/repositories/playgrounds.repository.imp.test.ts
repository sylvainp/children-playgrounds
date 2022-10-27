/* eslint-disable global-require */
import { container, Lifecycle } from "tsyringe";
import HeraultdataDatasource from "../../../src/data/datasources/heraultdata.datasource";
import PlaygroundHeraultDataModel from "../../../src/data/models/playground_heraultdata.model";
import PlaygroundsRepositoryImpl from "../../../src/data/repositories/playgrounds.repository.impl";
import PlaygroundEntity from "../../../src/domain/entities/playground.entity";
import PlaygroundRepository, {
  PlaygroundRepositoryInjectorName,
} from "../../../src/domain/repositories/playground.repository";
import HeraultdataDatasourceMock from "../../mocks/heraultdata.datasource.mock";

describe("PlaygroundsRepositoryImpl", () => {
  let repository: PlaygroundRepository;
  let heraultDatasource: HeraultdataDatasourceMock;
  beforeAll(() => {
    container.register(
      PlaygroundRepositoryInjectorName,
      { useClass: PlaygroundsRepositoryImpl },
      { lifecycle: Lifecycle.Singleton }
    );
    heraultDatasource = container.resolve(HeraultdataDatasource.injectorName);
    repository = container.resolve(PlaygroundRepositoryInjectorName);
  });

  it("repository must be resolved by DI", async () => {
    expect.assertions(2);
    expect(repository).toBeDefined();
    expect(repository instanceof PlaygroundsRepositoryImpl).toBe(true);
  });

  it("getAll function must call heraultdatasource fetchAllRepository function", async () => {
    expect.assertions(1);
    jest.spyOn(heraultDatasource, "fetchAllPlaygrounds").mockResolvedValue([]);
    await repository.getAll();
    expect(heraultDatasource.fetchAllPlaygrounds).toHaveBeenCalledTimes(1);
  });

  it("getAll must return PlaygroundEntity array built on heraultdatasource response", async () => {
    expect.assertions(1);
    const mockReturnedValue: PlaygroundHeraultDataModel[] =
      require("../../mocks/herault_data_playgrounds.json") as PlaygroundHeraultDataModel[];

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
              latitude: `${item.geometry.coordinates[1]}`,
              longitude: `${item.geometry.coordinates[0]}`,
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
