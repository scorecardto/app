import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import ActionButton from "../../input/ActionButton";
import { NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { reloadApp } from "../../../lib/reloadApp";
const icon = require("../../../assets/icon.svg");

export default function NotificationsScreen(props: {
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
        <View
          style={{
            marginTop: 32,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 24,
              lineHeight: 32,
              marginTop: 12,
              marginBottom: 50,
              paddingHorizontal: 48,
              textAlign: "center",
            }}
          >
            Allow notifications on the next screen to see club and class
            updates.
          </Text>
        </View>
      </View>
      <View
        style={{
          paddingTop: 64,
          paddingHorizontal: 32,
          flexDirection: "column",
          alignItems: "stretch",
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            Notifications.requestPermissionsAsync().then((result) => {
              reloadApp();
            });
          }}
        >
          <View
            style={{
              marginTop: 8,
              backgroundColor: "#FFFFFF",
              paddingVertical: 12,
              borderRadius: 100,
              width: "100%",
              alignSelf: "flex-end",
              overflow: "hidden",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                textAlign: "center",
                fontWeight: "500",
                color: "#000000",
              }}
            >
              Continue
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
