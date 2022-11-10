import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  ScrollView,
  KeyboardTypeOptions,
} from "react-native";
import { container } from "tsyringe";
import React from "react";
import { useForm, Controller, FieldError, Control } from "react-hook-form";
import SignupUsecase from "../domain/usecases/signup/signup.usecase";
import { SignupInput } from "../common/components/signup_input";

const PASSWORD_LENGTH = 10;
const styles = StyleSheet.create({
  scrollview: {
    padding: 8,
  },
  signupButton: {
    height: 50,
    justifyContent: "center",
    backgroundColor: "#b5614e",
    borderRadius: 5,
    marginVertical: 16,
  },

  signupLabel: {
    color: "white",
    textAlign: "center",
    fontSize: 22,
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

  const onSubmit = (data: any) => console.log({ data });

  return (
    <ScrollView style={styles.scrollview}>
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
        fieldError={errors.lastName}
        errorMessage="Veuillez renseigner votre nom"
        fieldName="lastName"
        formControl={control}
        fieldRules={{
          required: true,
        }}
        placeholder="Nom"
      />

      <SignupInput
        fieldError={errors.firstName}
        errorMessage="Veuillez renseigner votre prénom"
        fieldName="firstName"
        formControl={control}
        fieldRules={{
          required: true,
        }}
        placeholder="Prénom"
      />
      <SignupInput
        fieldError={errors.password}
        errorMessage={`Votre mot de passe doit contenir ${PASSWORD_LENGTH} caractères`}
        fieldName="password"
        formControl={control}
        fieldRules={{
          required: true,
          maxLength: PASSWORD_LENGTH,
        }}
        placeholder="Mot de passe"
      />

      <SignupInput
        fieldError={errors.confirmedPassword}
        errorMessage="Les deux mots de passe ne correspondent pas"
        fieldName="confirmedPassword"
        formControl={control}
        fieldRules={{
          required: true,
          maxLength: PASSWORD_LENGTH,
          validate: (value: string) => value === getValues("password"),
        }}
        placeholder="Confirmation mot de passe"
      />

      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.signupLabel}>S&apos;inscrire</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default SignupComponent;
