/* eslint-disable class-methods-use-this */
import { autoInjectable } from "tsyringe";
import PlaygroundEntity from "../../../src/domain/entities/playground.entity";
import PlaygroundRepository from "../../../src/domain/repositories/playground.repository";

@autoInjectable()
export default class PlaygroundRepositoryMock implements PlaygroundRepository {
  getAll(): Promise<PlaygroundEntity[] | Error> {
    return Promise.resolve([]);
  }
}
