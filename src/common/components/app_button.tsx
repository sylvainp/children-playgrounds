import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { CHColor, CHDimen, CHFont } from "../theme";

export type CHButtonProp = {
  title: string;
  onPress: () => void;
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: CHColor.main,
    borderRadius: CHDimen.radius,
    height: 50,
    justifyContent: "center",
    marginVertical: 16,
  },

  label: {
    color: CHFont.default_color,
    fontFamily: CHFont.family,
    fontSize: CHFont.title_size,
    textAlign: "center",
  },
});

function CHButton(prop: CHButtonProp) {
  const { onPress, title } = prop;
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
}

export default CHButton;
