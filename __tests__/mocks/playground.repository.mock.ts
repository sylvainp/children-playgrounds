/* eslint-disable class-methods-use-this */
import { autoInjectable } from "tsyringe";
import playgroundEntity from "../../src/domain/entities/playground.entity";
import PlaygroundRepository from "../../src/domain/repositories/playground.repository";

@autoInjectable()
export default class PlaygroundRepositoryMock implements PlaygroundRepository {
  getAll(): Promise<playgroundEntity[] | Error> {
    return Promise.resolve([]);
  }
}
