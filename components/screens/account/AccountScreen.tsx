import React from "react";
import { Text, View } from "react-native";
import Header from "../../text/Header";
import AccountOptionCard from "../../app/account/AccountOptionCard";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen(props: { route: any; navigation: any }) {
  return (
    <SafeAreaView>
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
          onPress={() => {
            props.navigation.navigate("gradebookSettings");
          }}
        />
        {/* 
        <AccountOptionCard
          label="Appearance"
          icon="palette"
          onPress={() => {}}
        /> */}

        <AccountOptionCard
          label="Help"
          icon="help-circle"
          onPress={() => {
            props.navigation.navigate("help", {
              reason: "help",
            });
          }}
        />

        <AccountOptionCard
          label="Report a Bug"
          icon="flag"
          onPress={() => {
            props.navigation.navigate("help", {
              reason: "bug",
            });
          }}
        />

        <AccountOptionCard
          label="Suggest a Feature"
          icon="heart-plus"
          onPress={() => {
            props.navigation.navigate("help", {
              reason: "suggestion",
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
}
