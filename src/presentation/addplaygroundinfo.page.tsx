/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { useForm } from "react-hook-form";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  faStar,
  faFileEdit,
  faPuzzlePiece,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { RouteProp, useRoute } from "@react-navigation/native";
import { CHTextInput } from "../common/components/app_input";
import { CHColor, CHDimen, CHFont } from "../common/theme";
import CHButton from "../common/components/app_button";
import usePlaygroundState from "./playgroundstate.hook";
import { RootStackParamList } from "../../App";

type GameItem = { id: number; name: string };
const styles = StyleSheet.create({
  root: {
    backgroundColor: CHColor.background,
    paddingVertical: CHDimen.vertical_padding,
    paddingHorizontal: CHDimen.horizontal_padding,
  },

  label_container: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 4,
    marginTop: 16,
  },
  label: {
    fontSize: CHFont.subtitle_size,
    color: CHColor.main,
  },
});

const playgroundInfoLabel = (icon: IconDefinition, text: string) => (
  <View style={styles.label_container}>
    <FontAwesomeIcon
      style={{ marginRight: 4 }}
      color="#b5614e"
      icon={icon}
      size={20}
    />
    <Text style={styles.label}>{text}</Text>
  </View>
);

const createGridComponent = (items: GameItem[]) => (
  <View
    style={{
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
    }}
  >
    {items.map((item) => (
      <TouchableOpacity
        style={{
          borderWidth: 2,
          borderColor: CHColor.main,
          borderRadius: CHDimen.radius,
          backgroundColor: "white",
          width: "20%",
          height: "20%",
          aspectRatio: 1,
          marginRight: 3,
          marginVertical: 3,
          justifyContent: "center",
        }}
        key={item.id}
        onPress={console.log}
      >
        <Text
          style={{
            padding: 2,
            textAlign: "center",
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const fakeGames = [
  { id: 1, name: "Structure grimpe" },
  { id: 2, name: "Balancoire" },
  { id: 3, name: "Bascule deux places" },
  { id: 4, name: "Filet" },
  { id: 5, name: "Terrain de football" },
  { id: 6, name: "Tobogan" },
  { id: 7, name: "Tourniquet" },
  { id: 8, name: "Terrain de basketball" },
];

function AddPlaygroundInfoPage() {
  const route =
    useRoute<RouteProp<RootStackParamList, "AddPlaygroundInfoPage">>();
  const { playgroundId, userId } = route.params;
  const { isLoading, error, addPlaygroundInfo } = usePlaygroundState();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { rate: 0, comment: "" } });

  return (
    <ScrollView style={styles.root}>
      {playgroundInfoLabel(faStar, "Note")}
      <CHTextInput
        fieldError={errors.rate}
        errorMessage="Merci de mettre une note de 0 à 5"
        fieldName="rate"
        formControl={control}
        fieldRules={{
          require: true,
          valueAsNumber: true,
          validate: (value: number) => value >= 0 && value <= 5,
        }}
        placeholder="Note"
      />
      {playgroundInfoLabel(faFileEdit, "Commentaire")}

      <CHTextInput
        fieldError={errors.comment}
        errorMessage=""
        fieldName="comment"
        formControl={control}
        fieldRules={{
          require: false,
          validate: (value: string) => value.length < 280,
        }}
        placeholder="Commentaire"
        multiline
        height={100}
      />
      {/* {playgroundInfoLabel(faPuzzlePiece, "Jeux")}

      {createGridComponent(fakeGames)} */}

      <CHButton
        title="Valider"
        onPress={handleSubmit((data: any) =>
          addPlaygroundInfo({
            playgroundId,
            userId,
            comment: data.comment,
            rate: data.rate,
          })
        )}
      />
    </ScrollView>
  );
}

export default AddPlaygroundInfoPage;
