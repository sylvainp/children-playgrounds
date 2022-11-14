import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

export type CHButtonProp = {
  title: string;
  onPress: () => void;
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    justifyContent: "center",
    backgroundColor: "#b5614e",
    borderRadius: 5,
    marginVertical: 16,
  },

  label: {
    color: "white",
    textAlign: "center",
    fontSize: 22,
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
