/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { faStar, faFileEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { RouteProp, useRoute } from "@react-navigation/native";
import { CHTextInput } from "../common/components/app_input";
import { CHColor, CHDimen, CHFont } from "../common/theme";
import CHButton from "../common/components/app_button";
import usePlayground from "./playground.hook";
import { RootStackParamList } from "../common/root_stack_param_list";

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

function AddPlaygroundInfoPage() {
  const route =
    useRoute<RouteProp<RootStackParamList, "AddPlaygroundInfoPage">>();
  const { playgroundId, userId } = route.params;
  const {
    isLoading,
    error,
    visitedPlayground,
    addPlaygroundInfo,
    getVisitedPlayground,
  } = usePlayground();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      rate: 0,
      comment: "",
    },
  });

  useEffect(() => {
    getVisitedPlayground(playgroundId, userId);
  }, []);

  useEffect(() => {
    reset({
      rate: visitedPlayground ? visitedPlayground.rate : 0,
      comment: visitedPlayground ? visitedPlayground.comment : "",
    });
  }, [visitedPlayground]);

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
        inputType="numeric"
        defaultValue={
          visitedPlayground ? `${visitedPlayground!.rate}` : undefined
        }
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
        defaultValue={
          visitedPlayground ? `${visitedPlayground!.comment}` : undefined
        }
      />
      <CHButton
        title="Valider"
        onPress={handleSubmit((data: any) => {
          addPlaygroundInfo({
            playgroundId,
            userId,
            comment: data.comment,
            rate: data.rate,
          });
        })}
      />
    </ScrollView>
  );
}

export default AddPlaygroundInfoPage;
