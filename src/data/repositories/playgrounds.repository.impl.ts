import { inject, injectable } from "tsyringe";
import PlaygroundEntity from "../../domain/entities/playground.entity";
import PlaygroundRepository from "../../domain/repositories/playground.repository";
import {
  UserRepository,
  UserRepositoryInjectorName,
} from "../../domain/repositories/user.repository";
import HeraultdataDatasource from "../datasources/heraultdata.datasource";
import SupabaseDatasource from "../datasources/supabase.datasource";
import PlaygroundHeraultDataModel from "../models/playground_heraultdata.model";
import { PlaygroundSupabaseModel } from "../models/playground_supabase.model";

@injectable()
export default class PlaygroundsRepositoryImpl implements PlaygroundRepository {
  constructor(
    @inject(UserRepositoryInjectorName)
    private userRepository: UserRepository,
    @inject(HeraultdataDatasource.injectorName)
    private heraultDatasource: HeraultdataDatasource,
    @inject(SupabaseDatasource.injectorName)
    private supabaseDatasource: SupabaseDatasource
  ) {}

  async getAll(): Promise<PlaygroundEntity[] | Error> {
    if (this.userRepository.loggedUser) {
      try {
        const supabaseDatasourceResult: PlaygroundSupabaseModel[] =
          await this.supabaseDatasource.getPlaygrounds();
        return supabaseDatasourceResult.map(
          (item) =>
            new PlaygroundEntity(
              item.id,
              item.cityName,
              {
                latitude: item.coordinate.latitude,
                longitude: item.coordinate.longitude,
              },
              item.updateDate
            )
        );
      } catch (error) {
        if (error instanceof Error) {
          return Promise.resolve(error);
        }
        return Promise.resolve(new Error(JSON.stringify(error)));
      }
    } else {
      try {
        const datasourceResult: PlaygroundHeraultDataModel[] =
          await this.heraultDatasource.fetchAllPlaygrounds();
        return datasourceResult.map(
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
        );
      } catch (error) {
        if (error instanceof Error) {
          return Promise.resolve(error);
        }
        return Promise.resolve(new Error(JSON.stringify(error)));
      }
    }
  }
}
