import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import SignupComponent from "./signup.component";
import SigninComponent from "./signin.component";
import { CHColor, CHDimen, CHFont } from "../common/theme";

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#f4c8be",
    padding: 8,
  },

  segment_control: {
    margin: 16,
    height: 50,
  },

  inactive_font_style: {
    color: CHColor.main,
    fontSize: CHFont.title_size,
    fontFamily: CHFont.family,
  },
  active_font_style: {
    color: CHFont.default_color,
    fontSize: CHFont.title_size,
    fontFamily: CHFont.family,
  },
});

function LoginPage() {
  const [index, setIndex] = useState(0);
  return (
    <View style={styles.container}>
      <SegmentedControl
        style={styles.segment_control}
        values={["Se connecter", "S'inscrire"]}
        selectedIndex={0}
        tintColor={CHColor.main}
        fontStyle={styles.inactive_font_style}
        activeFontStyle={styles.active_font_style}
        onChange={(event) => {
          setIndex(event.nativeEvent.selectedSegmentIndex);
        }}
      />
      {index === 0 && <SigninComponent />}
      {index === 1 && <SignupComponent />}
    </View>
  );
}

export default LoginPage;
