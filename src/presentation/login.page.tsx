import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import SignupComponent from "./signup.component";
import SigninComponent from "./signin.component";

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
});

function LoginPage() {
  const [index, setIndex] = useState(0);
  return (
    <View style={styles.container}>
      <SegmentedControl
        style={styles.segment_control}
        values={["Se connecter", "S'inscrire"]}
        selectedIndex={0}
        tintColor="#b5614e"
        fontStyle={{ color: "#b5614e" }}
        activeFontStyle={{ color: "white" }}
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
