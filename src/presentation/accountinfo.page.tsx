import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faEnvelope,
  faUser,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import UserEntity from "../domain/entities/user.entity";
import useLoggedUser from "../common/redux/user.hook";
import CHButton from "../common/components/app_button";
import useAuthState from "./authstate.hook";

const styles = StyleSheet.create({
  root: { padding: 8 },

  input: {
    height: 40,
    borderWidth: 0,
    padding: 10,
    borderRadius: 5,
    marginTop: 8,
    backgroundColor: "white",
    color: "grey",
  },

  label_container: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 4,
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    color: "#b5614e",
  },
});

const accountLabel = (icon: IconDefinition, text: string) => (
  <View style={styles.label_container}>
    <FontAwesomeIcon
      style={{ marginRight: 4 }}
      color="#b5614e"
      icon={icon}
      size={20}
    />
    <Text style={styles.label}>{text}</Text>
  </View>
);

const accountInput = (placeholder: string, value?: string) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    editable={false}
    value={value}
  />
);

function AccountInfoPage() {
  const user: UserEntity | null = useLoggedUser();
  const { isLoading, signout } = useAuthState();
  return (
    <ScrollView style={styles.root}>
      {accountLabel(faEnvelope, "Email")}
      {accountInput("Email", user?.email)}
      {accountLabel(faUser, "Prénom")}
      {accountInput("Prénom", user?.givenName)}
      {accountLabel(faUser, "Nom")}
      {accountInput("Nom", user?.familyName)}
      <CHButton title="Se déconnecter" onPress={signout} />
      {isLoading && <ActivityIndicator size="large" />}
    </ScrollView>
  );
}

export default AccountInfoPage;
