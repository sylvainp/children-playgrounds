import React from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import CHButton from "../common/components/app_button";
import { SignupInput } from "../common/components/signup_input";
import authState from "./authstate.hook";

function SigninComponent() {
  const { isLoading, error, signin } = authState();

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
      <SignupInput
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
      <SignupInput
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
      {error && <Text style={{ color: "red" }}>{error.message}</Text>}
      {isLoading && <ActivityIndicator size="large" />}
    </ScrollView>
  );
}

export default SigninComponent;
