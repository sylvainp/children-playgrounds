/* eslint-disable class-methods-use-this */
import { autoInjectable } from "tsyringe";
import PlaygroundEntity from "../../../src/domain/entities/playground.entity";
import TestedPlaygroundEntity from "../../../src/domain/entities/testedplayground.entity";
import PlaygroundRepository from "../../../src/domain/repositories/playground.repository";

@autoInjectable()
export default class PlaygroundRepositoryMock implements PlaygroundRepository {
  getAll(): Promise<PlaygroundEntity[] | Error> {
    return Promise.resolve([]);
  }

  addInfo(
    request: AddPlaygroundInfoRequest
  ): Promise<TestedPlaygroundEntity | Error> {
    return Promise.resolve(new TestedPlaygroundEntity("1", "2", 3));
  }
}
