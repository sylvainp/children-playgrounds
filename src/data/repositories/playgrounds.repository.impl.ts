import { inject, injectable } from "tsyringe";
import PlaygroundEntity from "../../domain/entities/playground.entity";
import PlaygroundRepository from "../../domain/repositories/playground.repository";
import HeraultdataDatasource from "../datasources/heraultdata.datasource";
import PlaygroundHeraultDataModel from "../models/playground_heraultdata.model";

@injectable()
export default class PlaygroundsRepositoryImpl implements PlaygroundRepository {
  constructor(
    @inject(HeraultdataDatasource.injectorName)
    private heraultDatasource: HeraultdataDatasource
  ) {}

  async getAll(): Promise<PlaygroundEntity[] | Error> {
    try {
      const datasourceResult: PlaygroundHeraultDataModel[] =
        await this.heraultDatasource.fetchAllPlaygrounds();
      return datasourceResult.map(
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
      );
    } catch (error) {
      if (error instanceof Error) {
        return Promise.resolve(error);
      }
      return Promise.resolve(new Error(JSON.stringify(error)));
    }
  }
}
