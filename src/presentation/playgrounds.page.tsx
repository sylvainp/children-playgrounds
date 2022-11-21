import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import useLoggedUser from "../common/redux/user.hook";
import UserEntity from "../domain/entities/user.entity";
import createPlaygroundsState, { PlaygroundsState } from "./playgrounds.state";
import CHBottomSheet from "../common/components/bottom_sheet";
import PlaygroundEntity from "../domain/entities/playground.entity";
import CHButton from "../common/components/app_button";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#f4c8be",
    justifyContent: "center",
  },
  activity_indicator: {
    alignSelf: "center",
    alignItems: "center",
    color: "#b5614e",
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

  bottomSheetContent: {
    padding: 16,
  },
  bottomSheetText: {
    textAlign: "center",
    fontSize: 22,
    color: "white",
  },
  bottomSheetCloseButton: {
    padding: 16,
    backgroundColor: "deeppink",
    borderRadius: 8,
  },
});

const INITIAL_REGION = {
  latitude: 42.99237128064096,
  longitude: 4.037089711576773,
  latitudeDelta: 8.5,
  longitudeDelta: 8.5,
};

function PlaygroundsPage({ navigation }: any) {
  const pageState: PlaygroundsState = createPlaygroundsState();
  const loggedUser: UserEntity | null = useLoggedUser();
  const [selectedPlayground, setSelectedPlayground] =
    useState<PlaygroundEntity | null>(null);

  useEffect(() => {
    pageState.getAllPlaygrounds();
  }, []);

  const markerPressed = (pressedPlayground: PlaygroundEntity) => {
    setSelectedPlayground(pressedPlayground);
  };
  return (
    <View style={styles.container}>
      {pageState.isLoading && (
        <ActivityIndicator style={styles.activity_indicator} size="large" />
      )}
      {pageState.error && (
        <Text style={styles.error_label}>{pageState.error.message}</Text>
      )}
      {!pageState.isLoading && (
        <MapView initialRegion={INITIAL_REGION} style={{ flex: 1 }}>
          {pageState.playgrounds?.map((item) => (
            <Marker
              coordinate={item.coordinate}
              key={item.id}
              pinColor="#b5614e"
              onPress={() => markerPressed(item)}
            />
          ))}
        </MapView>
      )}

      <CHBottomSheet
        show={selectedPlayground !== null}
        height={290}
        onOuterClick={() => setSelectedPlayground(null)}
      >
        <View style={styles.bottomSheetContent}>
          {loggedUser === null && (
            <>
              <CHButton
                title="Se rendre au parc"
                onPress={async () => {
                  const coordinate = `${
                    selectedPlayground!.coordinate.latitude
                  },${selectedPlayground!.coordinate.longitude}`;
                  const label = `Parc pour enfant à ${
                    selectedPlayground!.cityName
                  }`;
                  const url = Platform.select({
                    ios: `maps:0,0?q=${label}@${coordinate}`,
                    android: `"geo:0,0?q="${coordinate}(${label})`,
                  });
                  const canOpenUrl = await Linking.canOpenURL(url ?? "");
                  if (canOpenUrl) {
                    Linking.openURL(url!);
                  } else {
                    Alert.alert(
                      "Mince !",
                      "Impossible de lancer la navigation"
                    );
                  }
                }}
              />
              <CHButton
                title="Ajouter des informations"
                onPress={() => navigation.navigate("LoginPage")}
              />
            </>
          )}
        </View>
      </CHBottomSheet>
    </View>
  );
}

export default PlaygroundsPage;
