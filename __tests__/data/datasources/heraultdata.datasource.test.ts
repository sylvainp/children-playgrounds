/* eslint-disable global-require */
import HeraultdataDatasource from "../../../src/data/datasources/heraultdata.datasource";
import PlaygroundHeraultDataModel from "../../../src/data/models/playground_heraultdata.model";

describe("heraultdataDatasource", () => {
  const baseUrl =
    "https://www.herault-data.fr/api/records/1.0/search/?dataset=aires-de-jeux-herault";
  let datasource: HeraultdataDatasource;

  beforeAll(() => {
    datasource = new HeraultdataDatasource();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockFetchRequest = (
    mockImplementation: { expectedResult: any; expectedStatus: number }[]
  ) => {
    let mockFetch: jest.Mock = jest.fn();
    mockImplementation.forEach((mock) => {
      mockFetch = mockFetch.mockResolvedValueOnce({
        status: mock.expectedStatus,
        json: jest.fn().mockResolvedValue(mock.expectedResult),
      });
    });

    globalThis.fetch = mockFetch;
  };

  it("fetchAll must call global fetch method with spécific url", async () => {
    expect.assertions(1);
    const expectedURL = `${baseUrl}&rows=25&start=0`;
    mockFetchRequest([
      { expectedResult: { records: [] }, expectedStatus: 200 },
    ]);

    await datasource.fetchAllPlaygrounds();
    expect(globalThis.fetch).toHaveBeenCalledWith(expectedURL, {
      method: "GET",
    });
  });

  it("fetchAll must return PlaygroundHeraultDatamodel array depending on fetch result", async () => {
    expect.assertions(2);
    const expectedItemsCount = 24;
    const expectedResult = require("../../mocks/datas/heraultdata_fetchall_page1_last.json");
    mockFetchRequest([{ expectedResult, expectedStatus: 200 }]);
    const result: PlaygroundHeraultDataModel[] =
      await datasource.fetchAllPlaygrounds();
    expect(result).toBeDefined();
    expect(result.length).toBe(expectedItemsCount);
  });

  it("fetchAll must throw an error if fetch request return status code other than 200", async () => {
    expect.assertions(1);
    const expectedError = { error: "internal server error", code: 500 };
    mockFetchRequest([{ expectedResult: expectedError, expectedStatus: 500 }]);
    await expect(datasource.fetchAllPlaygrounds()).rejects.toStrictEqual(
      new Error(JSON.stringify(expectedError))
    );
  });

  it("fetchAll must call global fetch function until all results are returned", async () => {
    expect.assertions(4);
    const expectedURL = `${baseUrl}&rows=25`;
    const expectedRequestInit = { method: "GET" };
    const expectedResult1 = require("../../mocks/datas/herault_data_fetch_pagination/heraultdata_fetchall_page1.json");
    const expectedResult2 = require("../../mocks/datas/herault_data_fetch_pagination/heraultdata_fetchall_page2.json");
    const expectedResult3 = require("../../mocks/datas/herault_data_fetch_pagination/heraultdata_fetchall_page3.json");
    mockFetchRequest([
      { expectedResult: expectedResult1, expectedStatus: 200 },
      { expectedResult: expectedResult2, expectedStatus: 200 },
      { expectedResult: expectedResult3, expectedStatus: 200 },
    ]);
    const result: PlaygroundHeraultDataModel[] =
      await datasource.fetchAllPlaygrounds();

    expect(result.length).toEqual(65);
    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      1,
      `${expectedURL}&start=0`,
      expectedRequestInit
    );
    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      2,
      `${expectedURL}&start=25`,
      expectedRequestInit
    );
    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      3,
      `${expectedURL}&start=50`,
      expectedRequestInit
    );
  });
});
