import "reflect-metadata";
import { container, Lifecycle } from "tsyringe";
import HeraultdataDatasource from "../src/data/datasources/heraultdata.datasource";
import { PlaygroundRepositoryInjectorName } from "../src/domain/repositories/playground.repository";
import HeraultdataDatasourceMock from "./mocks/heraultdata.datasource.mock";
import PlaygroundRepositoryMock from "./mocks/playground.repository.mock";

container
  .register(
    PlaygroundRepositoryInjectorName,
    { useClass: PlaygroundRepositoryMock },
    { lifecycle: Lifecycle.Singleton }
  )
  .register(
    HeraultdataDatasource.injectorName,
    { useClass: HeraultdataDatasourceMock },
    { lifecycle: Lifecycle.Singleton }
  );
