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
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
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

const INITIAL_REGION = {
  latitude: 42.99237128064096,
  longitude: 4.037089711576773,
  latitudeDelta: 8.5,
  longitudeDelta: 8.5,
};

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
          <MapView initialRegion={INITIAL_REGION} style={{ flex: 1 }}>
            {pageState.playgrounds.map((item) => (
              <Marker coordinate={item.coordinate} key={item.id} />
            ))}
          </MapView>
        )}
      </View>
    </SafeAreaView>
  );
}

export default PlaygroundsPage;
