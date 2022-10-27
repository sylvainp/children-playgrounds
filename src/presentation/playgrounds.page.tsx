import React, { useEffect } from "react";

import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PlaygroundEntity from "../domain/entities/playground.entity";
import createPlaygroundsState, { PlaygroundsState } from "./playgrounds.state";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white",
    justifyContent: "center",
  },
  activity_indicator: {
    alignSelf: "center",
    alignItems: "center",
  },

  error_label: {
    fontSize: 22,
    fontWeight: "normal",
    color: "red",
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  subtitle: {
    fontSize: 18,
    color: "light-grey",
  },
});

const renderItem = ({ item }: any) => (
  <View style={styles.item}>
    <Text style={styles.title}>{item.cityName}</Text>
    <Text
      style={styles.subtitle}
    >{`${item.coordinate.latitude}, ${item.coordinate.longitude}`}</Text>
  </View>
);

function PlaygroundsPage() {
  const pageState: PlaygroundsState = createPlaygroundsState();
  useEffect(() => {
    pageState.getAllPlaygrounds();
  }, []);
  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {pageState.isLoading && (
          <ActivityIndicator style={styles.activity_indicator} size="large" />
        )}
        {pageState.error && (
          <Text style={styles.error_label}>{pageState.error.message}</Text>
        )}
        {pageState.playgrounds && (
          <FlatList
            data={pageState.playgrounds}
            renderItem={renderItem}
            keyExtractor={(item: PlaygroundEntity) => item.id}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default PlaygroundsPage;
