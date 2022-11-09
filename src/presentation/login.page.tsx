import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { container } from "tsyringe";
import SignupUsecase from "../domain/usecases/signup/signup.usecase";

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#f4c8be",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  signupButton: {
    height: 50,
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
});

const onTestSignupPressed = () => {
  const signupUsecase = container.resolve(SignupUsecase);
  signupUsecase.call({
    email: "puccinell.sylvain@gmail.com",
    familyName: "Puccinelli",
    givenName: "Sylvain",
    password: "passwordpassword",
  });
};
function LoginPage() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.signupButton}
        onPress={onTestSignupPressed}
      >
        <Text style={{ textAlign: "center" }}>Test signup</Text>
      </TouchableOpacity>
    </View>
  );
}

export default LoginPage;
