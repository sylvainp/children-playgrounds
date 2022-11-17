/* eslint-disable global-require */
import "reflect-metadata";
import { container, Lifecycle } from "tsyringe";
import HeraultdataDatasource from "../src/data/datasources/heraultdata.datasource";
import SupabaseDatasource from "../src/data/datasources/supabase.datasource";
import { PlaygroundRepositoryInjectorName } from "../src/domain/repositories/playground.repository";
import { UserRepositoryInjectorName } from "../src/domain/repositories/user.repository";
import HeraultdataDatasourceMock from "./mocks/classes/heraultdata.datasource.mock";
import PlaygroundRepositoryMock from "./mocks/classes/playground.repository.mock";
import SupabaseDatasourceMock from "./mocks/classes/supabase.datasource.mock";
import UserRepositoryMock from "./mocks/classes/user.repository.mock";

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
  )
  .register(
    UserRepositoryInjectorName,
    { useClass: UserRepositoryMock },
    { lifecycle: Lifecycle.Singleton }
  )
  .register(
    SupabaseDatasource.injectorName,
    { useClass: SupabaseDatasourceMock },
    { lifecycle: Lifecycle.Singleton }
  );

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("@supabase/supabase-js", () => {
  const mockSupabase = jest.requireActual("@supabase/supabase-js");
  mockSupabase.createClient = () => ({
    auth: {
      signUp: () => Promise.resolve({ data: {}, error: {} }),
      onAuthStateChange: () => ({ data: {} }),
    },
  });

  return mockSupabase;
});
