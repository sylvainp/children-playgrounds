/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import { container, Lifecycle } from "tsyringe";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMap, faUser } from "@fortawesome/free-solid-svg-icons";
import { StyleSheet } from "react-native";
import { SUPABASE_PROJECT_ID, SUPABASE_ANON_KEY } from "@env";
import { Provider } from "react-redux";
import HeraultdataDatasource from "./src/data/datasources/heraultdata.datasource";
import PlaygroundsRepositoryImpl from "./src/data/repositories/playgrounds.repository.impl";
import { PlaygroundRepositoryInjectorName } from "./src/domain/repositories/playground.repository";
import PlaygroundsPage from "./src/presentation/playgrounds.page";
import LoginPage from "./src/presentation/login.page";
import SupabaseDatasource from "./src/data/datasources/supabase.datasource";
import { UserRepositoryInjectorName } from "./src/domain/repositories/user.repository";
import UserRepositoryImpl from "./src/data/repositories/user.repository.impl";
import useLoggedUser from "./src/common/redux/user.hook";
import UserEntity from "./src/domain/entities/user.entity";
import { store } from "./src/common/redux/store";
import AccountInfo from "./src/presentation/accountinfo.page";
import AccountInfoPage from "./src/presentation/accountinfo.page";

const Tab = createBottomTabNavigator();

container
  .register(
    PlaygroundRepositoryInjectorName,
    { useClass: PlaygroundsRepositoryImpl },
    { lifecycle: Lifecycle.Singleton }
  )
  .register(
    UserRepositoryInjectorName,
    { useClass: UserRepositoryImpl },
    { lifecycle: Lifecycle.Singleton }
  )
  .register(
    HeraultdataDatasource.injectorName,
    { useClass: HeraultdataDatasource },
    { lifecycle: Lifecycle.Singleton }
  )
  .register(
    SupabaseDatasource.injectorName,
    { useClass: SupabaseDatasource },
    { lifecycle: Lifecycle.Singleton }
  )
  .register("SUPABASE_PROJECT_ID", { useValue: SUPABASE_PROJECT_ID })
  .register("SUPABASE_ANON_KEY", { useValue: SUPABASE_ANON_KEY });

const styles = StyleSheet.create({
  bottom_bar: {
    backgroundColor: "#FBC687",
    borderRadius: 20,
    bottom: 25,
    left: 25,
    top: "auto",
    position: "absolute",
    right: 25,
    height: 60,
  },

  bottom_tab: { width: 25, height: 25 },

  header: {
    backgroundColor: "#b5614e",
  },

  header_title: {
    color: "white",
    fontSize: 28,
  },
});
const mapBottomTab = (focused: boolean) => (
  <FontAwesomeIcon
    color={focused ? "#b5614e" : "#EA907A"}
    icon={faMap}
    size={25}
    style={styles.bottom_tab}
  />
);
const loginBottomTab = (focused: boolean) => (
  <FontAwesomeIcon
    color={focused ? "#b5614e" : "#EA907A"}
    icon={faUser}
    size={25}
    style={styles.bottom_tab}
  />
);

function LoginAppContent() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.header_title,
          tabBarShowLabel: false,
          tabBarStyle: styles.bottom_bar,
        })}
      >
        <Tab.Screen
          name="PlaygroundPage"
          component={PlaygroundsPage}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => mapBottomTab(focused),
          }}
        />
        <Tab.Screen
          name="AccountInfoPage"
          component={AccountInfoPage}
          options={{
            title: "Compte",
            headerShown: true,
            tabBarIcon: ({ focused }) => loginBottomTab(focused),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function LogoutAppContent() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.header_title,
          tabBarShowLabel: false,
          tabBarStyle: styles.bottom_bar,
        })}
      >
        <Tab.Screen
          name="PlaygroundPage"
          component={PlaygroundsPage}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => mapBottomTab(focused),
          }}
        />
        <Tab.Screen
          name="LoginPage"
          component={LoginPage}
          options={{
            title: "Compte",
            headerShown: true,
            tabBarIcon: ({ focused }) => loginBottomTab(focused),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function App() {
  const user: UserEntity | null = useLoggedUser();
  return user !== null ? <LoginAppContent /> : <LogoutAppContent />;
}

function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default AppWrapper;
