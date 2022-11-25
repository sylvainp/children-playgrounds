import { Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { useForm } from "react-hook-form";
import { CHTextInput } from "../common/components/app_input";
import useAuthState from "./authstate.hook";
import CHButton from "../common/components/app_button";
import { CHFont } from "../common/theme";

const PASSWORD_LENGTH = 10;

const styles = StyleSheet.create({
  error_process: {
    color: CHFont.error,
    fontFamily: CHFont.family,
    fontSize: CHFont.subtitle_size,
  },
});
function SignupComponent() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmedPassword: "",
    },
  });

  const { isLoading, error, signup } = useAuthState();

  const onSubmit = (data: any) =>
    signup(data.email, data.firstName, data.lastName, data.password);

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
        fieldError={errors.lastName}
        errorMessage="Veuillez renseigner votre nom"
        fieldName="lastName"
        formControl={control}
        fieldRules={{
          required: true,
        }}
        placeholder="Nom"
      />

      <CHTextInput
        fieldError={errors.firstName}
        errorMessage="Veuillez renseigner votre prénom"
        fieldName="firstName"
        formControl={control}
        fieldRules={{
          required: true,
        }}
        placeholder="Prénom"
      />
      <CHTextInput
        fieldError={errors.password}
        errorMessage={`Votre mot de passe doit contenir ${PASSWORD_LENGTH} caractères`}
        fieldName="password"
        formControl={control}
        fieldRules={{
          required: true,
          minLength: PASSWORD_LENGTH,
        }}
        placeholder="Mot de passe"
        secureEntry
      />

      <CHTextInput
        fieldError={errors.confirmedPassword}
        errorMessage="Les deux mots de passe ne correspondent pas"
        fieldName="confirmedPassword"
        formControl={control}
        fieldRules={{
          required: true,
          minLength: PASSWORD_LENGTH,
          validate: (value: string) => value === getValues("password"),
        }}
        placeholder="Confirmation mot de passe"
        secureEntry
      />

      <CHButton title="S'inscrire" onPress={handleSubmit(onSubmit)} />
      {error && <Text style={styles.error_process}>{error.message}</Text>}
      {isLoading && <ActivityIndicator size="large" />}
    </ScrollView>
  );
}

export default SignupComponent;
