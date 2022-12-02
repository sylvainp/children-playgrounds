import React from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";
import CHButton from "../common/components/app_button";
import { CHTextInput } from "../common/components/app_input";
import { CHFont } from "../common/theme";
import useAuth from "./auth.hook";

const styles = StyleSheet.create({
  error_process: {
    color: CHFont.error,
    fontFamily: CHFont.family,
    fontSize: CHFont.subtitle_size,
  },
});
function SigninComponent() {
  const { isLoading, error, signin } = useAuth();

  const onSubmit = (data: any) => signin(data.email, data.password);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <ScrollView>
      <CHTextInput
        fieldError={errors.email}
        errorMessage="Veuillez renseigner un email valide"
        fieldName="email"
        formControl={control}
        fieldRules={{
          required: true,
          pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        }}
        placeholder="Email"
        inputType="email-address"
      />
      <CHTextInput
        fieldError={errors.password}
        errorMessage="Veuillez renseigner votre mot de passe"
        fieldName="password"
        formControl={control}
        fieldRules={{
          required: true,
        }}
        placeholder="Mot de passe"
        secureEntry
      />

      <CHButton title="Se connecter" onPress={handleSubmit(onSubmit)} />
      {error && <Text style={styles.error_process}>{error.message}</Text>}
      {isLoading && <ActivityIndicator size="large" />}
    </ScrollView>
  );
}

export default SigninComponent;
