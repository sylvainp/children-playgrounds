/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from "react";
import { container, Lifecycle } from "tsyringe";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMap,
  faUser,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SUPABASE_PROJECT_ID, SUPABASE_ANON_KEY } from "@env";
import { Provider } from "react-redux";
import SplashScreen from "react-native-splash-screen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
import AccountInfoPage from "./src/presentation/accountinfo.page";
import { CHColor, CHFont } from "./src/common/theme";
import AddPlaygroundInfoPage from "./src/presentation/addplaygroundinfo.page";

export type RootStackParamList = {
  AddPlaygroundInfoPage: { playgroundId: string; userId: string };
  MainLoginPage: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

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
    backgroundColor: CHColor.bottom_bar_background,
    borderRadius: 20,
    bottom: 25,
    left: 25,
    top: "auto",
    position: "absolute",
    right: 25,
    height: 60,
  },

  bottom_tab: {
    position: "absolute",
    top: 17,
  },

  header: {
    backgroundColor: CHColor.main,
  },

  header_title: {
    color: CHFont.default_color,
    fontSize: 28,
    fontFamily: CHFont.family,
  },

  header_back_container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  header_back: {
    color: CHFont.default_color,
    fontSize: 18,
    fontFamily: CHFont.family,
  },
});

const backButton = (navigation: any) => (
  <TouchableOpacity
    style={styles.header_back_container}
    onPress={() => navigation.navigate("MainLoginPage")}
  >
    <FontAwesomeIcon
      icon={faChevronLeft}
      size={15}
      color={CHFont.default_color}
    />
    <Text style={styles.header_back}>Retour</Text>
  </TouchableOpacity>
);

const mapBottomTab = (focused: boolean) => (
  <FontAwesomeIcon
    color={focused ? CHColor.main : CHColor.second}
    icon={faMap}
    size={25}
    style={styles.bottom_tab}
  />
);
const loginBottomTab = (focused: boolean) => (
  <FontAwesomeIcon
    color={focused ? CHColor.main : CHColor.second}
    icon={faUser}
    size={25}
    style={styles.bottom_tab}
  />
);

function MainLoginScreen() {
  return (
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
  );
}

function LoginAppContent() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainLoginPage"
          component={MainLoginScreen}
          options={{ headerShown: false, title: "Tous les parcs" }}
        />
        <Stack.Screen
          name="AddPlaygroundInfoPage"
          component={AddPlaygroundInfoPage}
          options={({ navigation }) => ({
            headerStyle: styles.header,
            headerTitleStyle: styles.header_title,
            headerBackTitleStyle: styles.header_title,
            headerLeft: () => backButton(navigation),
            title: "Ajouter des informations",
          })}
        />
      </Stack.Navigator>
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
  useEffect(() => SplashScreen.hide());
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default AppWrapper;
