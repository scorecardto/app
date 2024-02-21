import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import ActionButton from "../../input/ActionButton";
import { NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const icon = require("../../../assets/icon.svg");

export default function StartScreen(props: {
  route: any;
  navigation: NavigationProp<any, any>;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#2D8EC5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: insets.top / 2,
      }}
    >
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Image
          source={icon}
          style={{
            height: 148,
            aspectRatio: 1,
          }}
        />
        <Text
          style={{
            color: "white",
            fontSize: 24,
            lineHeight: 32,
            marginTop: 50,
            marginBottom: 50,
            paddingHorizontal: 48,
            textAlign: "center",
          }}
        >
          Welcome to Scorecard! Use this app to easily check your grades.
        </Text>
        <ActionButton
          type="WHITE"
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{ name: "selectDistrict" }],
            });
          }}
        >
          Select Your School
        </ActionButton>
      </View>
    </View>
  );
}
