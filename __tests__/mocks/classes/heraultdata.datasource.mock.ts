import HeraultdataDatasource from "../../../src/data/datasources/heraultdata.datasource";

export default class HeraultdataDatasourceMock extends HeraultdataDatasource {
  protected get records_per_page(): number {
    return 25;
  }
}
