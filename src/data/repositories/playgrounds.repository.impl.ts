import { inject, injectable } from "tsyringe";
import PlaygroundEntity from "../../domain/entities/playground.entity";
import TestedPlaygroundEntity from "../../domain/entities/testedplayground.entity";
import PlaygroundRepository from "../../domain/repositories/playground.repository";
import {
  UserRepository,
  UserRepositoryInjectorName,
} from "../../domain/repositories/user.repository";
import AddPlaygroundInfoRequest from "../../domain/usecases/addPlaygroundInfo/add_playground_info.request";
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
          (playgroundmodel) =>
            new PlaygroundEntity(
              playgroundmodel.id,
              playgroundmodel.cityName,
              {
                latitude: playgroundmodel.coordinate.latitude,
                longitude: playgroundmodel.coordinate.longitude,
              },
              playgroundmodel.updateDate,
              playgroundmodel.tested_playground
                ? playgroundmodel.tested_playground.map(
                    (testedplaygroundmodel) =>
                      new TestedPlaygroundEntity(
                        testedplaygroundmodel.user_id,
                        testedplaygroundmodel.playground_id,
                        testedplaygroundmodel.rate,
                        testedplaygroundmodel.comment
                      )
                  )
                : undefined
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

  async addInfo(
    request: AddPlaygroundInfoRequest
  ): Promise<TestedPlaygroundEntity | Error> {
    await this.supabaseDatasource.addPlaygroundInfo(request);
  }
}
