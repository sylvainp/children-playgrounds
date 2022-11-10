import React from "react";

import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Controller, FieldError, Control } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export type SignupProp = {
  errorMessage: string;
  fieldError: FieldError | undefined;
  fieldName: string;
  fieldRules: any;
  formControl: Control<any>;
  inputType?: KeyboardTypeOptions;
  placeholder: string;
};

const styles = StyleSheet.create({
  root: { paddingVertical: 8 },

  input: {
    height: 40,
    borderWidth: 0,
    padding: 10,
    borderRadius: 5,

    backgroundColor: "white",
  },

  input_error_container: { flex: 1, flexDirection: "row", paddingTop: 4 },
  input_error_text: {
    fontSize: 16,
    color: "#E40017",
  },
});

export function SignupInput(props: SignupProp) {
  const {
    errorMessage,
    fieldError,
    fieldName,
    fieldRules,
    formControl,
    inputType,
    placeholder,
  } = props;
  return (
    <View style={styles.root}>
      <Controller
        name={fieldName}
        control={formControl}
        rules={fieldRules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            keyboardType={inputType ?? "default"}
            autoCapitalize="none"
            placeholder={placeholder}
            placeholderTextColor="#504D4D"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {fieldError && (
        <View style={styles.input_error_container}>
          <FontAwesomeIcon
            style={{ marginRight: 4 }}
            color="#E40017"
            icon={faCircleInfo}
            size={20}
          />
          <Text style={styles.input_error_text}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
}
SignupInput.defaultProps = {
  inputType: "default",
};
