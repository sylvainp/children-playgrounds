/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import { container, Lifecycle } from "tsyringe";
import { SafeAreaView } from "react-native";
import HeraultdataDatasource from "./src/data/datasources/heraultdata.datasource";
import PlaygroundsRepositoryImpl from "./src/data/repositories/playgrounds.repository.impl";
import { PlaygroundRepositoryInjectorName } from "./src/domain/repositories/playground.repository";
import PlaygroundsPage from "./src/presentation/playgrounds.page";

container
  .register(
    PlaygroundRepositoryInjectorName,
    { useClass: PlaygroundsRepositoryImpl },
    { lifecycle: Lifecycle.Singleton }
  )
  .register(
    HeraultdataDatasource.injectorName,
    { useClass: HeraultdataDatasource },
    { lifecycle: Lifecycle.Singleton }
  );
function App() {
  return (
    <SafeAreaView>
      <PlaygroundsPage />
    </SafeAreaView>
  );
}

export default App;
