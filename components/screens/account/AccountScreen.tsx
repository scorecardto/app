import React from "react";
import { Text, View } from "react-native";
import Header from "../../text/Header";
import AccountOptionCard from "../../app/account/AccountOptionCard";

export default function AccountScreen(props: { route: any; navigation: any }) {
  return (
    <View>
      <Header header="Account" />

      <View>
        <AccountOptionCard
          label="General"
          icon="cog"
          onPress={() => {
            props.navigation.navigate("generalSettings");
          }}
        />

        <AccountOptionCard
          label="Account Details"
          icon="key"
          onPress={() => {}}
        />

        <AccountOptionCard
          label="Appearance"
          icon="palette"
          onPress={() => {}}
        />

        <AccountOptionCard label="Help" icon="help-circle" onPress={() => {}} />

        <AccountOptionCard
          label="Report a Bug"
          icon="flag"
          onPress={() => {}}
        />

        <AccountOptionCard
          label="Suggest a Feature"
          icon="heart-plus"
          onPress={() => {}}
        />
      </View>
    </View>
  );
}
