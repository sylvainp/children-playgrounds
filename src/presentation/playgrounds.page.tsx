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
import { Marker, MarkerPressEvent } from "react-native-maps";
import useLoggedUser from "../common/redux/user.hook";
import UserEntity from "../domain/entities/user.entity";
import CHBottomSheet from "../common/components/bottom_sheet";
import PlaygroundEntity from "../domain/entities/playground.entity";
import CHButton from "../common/components/app_button";
import { CHColor, CHFont } from "../common/theme";
import usePlaygroundState from "./playgroundstate.hook";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: CHColor.background,
    justifyContent: "center",
  },
  activity_indicator: {
    alignSelf: "center",
    alignItems: "center",
    color: CHColor.main,
  },

  error_label: {
    fontSize: CHFont.subtitle_size,
    fontWeight: "normal",
    color: CHFont.error,
  },

  bottomSheetContent: {
    padding: 16,
  },
});

const INITIAL_REGION = {
  latitude: 42.99237128064096,
  longitude: 4.037089711576773,
  latitudeDelta: 8.5,
  longitudeDelta: 8.5,
};

const pinColor = (
  playground: PlaygroundEntity,
  loggedUser: UserEntity | null
): string => {
  if (loggedUser === null) {
    return CHColor.default_pin;
  }
  if (playground.isVisitedPlaygroundForUserId(loggedUser.id)) {
    return CHColor.own_visited_pin;
  }
  if (playground.testedPlayground && playground.testedPlayground.length > 0) {
    return CHColor.other_visited_pin;
  }
  return CHColor.default_pin;
};

const customMarker = (
  playground: PlaygroundEntity,
  onMarkerPress: (playground: PlaygroundEntity) => void,
  loggedUser: UserEntity | null
) => (
  <Marker
    coordinate={playground.coordinate}
    key={playground.id}
    pinColor={pinColor(playground, loggedUser)}
    onPress={(item) => onMarkerPress(playground)}
  />
);

function PlaygroundsPage({ navigation }: any) {
  // const pageState: PlaygroundsState = createPlaygroundsState();
  const { allPlaygrounds, isLoading, error, getAllPlaygrounds } =
    usePlaygroundState();
  const loggedUser: UserEntity | null = useLoggedUser();
  const [selectedPlayground, setSelectedPlayground] =
    useState<PlaygroundEntity | null>(null);

  useEffect(() => {
    getAllPlaygrounds();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading && (
        <ActivityIndicator style={styles.activity_indicator} size="large" />
      )}
      {error && <Text style={styles.error_label}>{error.message}</Text>}
      {allPlaygrounds && (
        <MapView initialRegion={INITIAL_REGION} style={{ flex: 1 }}>
          {allPlaygrounds.map((item) =>
            customMarker(item, setSelectedPlayground, loggedUser)
          )}
        </MapView>
      )}

      <CHBottomSheet
        show={selectedPlayground !== null}
        height={290}
        onOuterClick={() => setSelectedPlayground(null)}
      >
        <View style={styles.bottomSheetContent}>
          <CHButton
            title="Se rendre au parc"
            onPress={async () => {
              const coordinate = `${selectedPlayground!.coordinate.latitude},${
                selectedPlayground!.coordinate.longitude
              }`;
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
                Alert.alert("Mince !", "Impossible de lancer la navigation");
              }
            }}
          />
          <CHButton
            title="Ajouter des informations"
            onPress={() =>
              loggedUser
                ? navigation.navigate("AddPlaygroundInfoPage", {
                    playgroundId: selectedPlayground?.id,
                    userId: loggedUser.id,
                  })
                : navigation.navigate("LoginPage")
            }
          />
        </View>
      </CHBottomSheet>
    </View>
  );
}

export default PlaygroundsPage;
