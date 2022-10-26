/* eslint-disable global-require */
import HeraultdataDatasource from "../../../src/data/datasources/heraultdata.datasource";
import PlaygroundHeraultDataModel from "../../../src/data/models/playground_heraultdata.model";

describe("heraultdataDatasource", () => {
  const expectedURL =
    "https://www.herault-data.fr/api/records/1.0/search/?dataset=aires-de-jeux-herault";
  let datasource: HeraultdataDatasource;

  beforeAll(() => {
    datasource = new HeraultdataDatasource();
  });

  const mockFetchRequest = (expectedResult: any, status: number) => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      status,
      json: jest.fn().mockResolvedValue(expectedResult),
    } as unknown as Response);
  };

  it("fetchAll must call global fetch method with spécific url", async () => {
    expect.assertions(1);
    mockFetchRequest({}, 200);

    await datasource.fetchAllPlaygrounds();
    expect(globalThis.fetch).toHaveBeenCalledWith(expectedURL, {
      method: "GET",
    });
  });

  it("fetchAll must return PlaygroundHeraultDatamodel array depending on fetch result", async () => {
    expect.assertions(2);
    const expectedItemsCount = 10;
    const expectedResult = require("../../mocks/heraultdata_fetchall_page1.json");
    mockFetchRequest(expectedResult, 200);
    const result: PlaygroundHeraultDataModel[] =
      await datasource.fetchAllPlaygrounds();
    expect(result).toBeDefined();
    expect(result.length).toBe(expectedItemsCount);
  });

  it("fetchAll must throw an error if fetch request return status code other than 200", async () => {
    expect.assertions(1);
    const expectedError = { error: "internal server error", code: 500 };
    mockFetchRequest(expectedError, 500);
    await expect(datasource.fetchAllPlaygrounds()).rejects.toStrictEqual(
      new Error(JSON.stringify(expectedError))
    );
  });
});
