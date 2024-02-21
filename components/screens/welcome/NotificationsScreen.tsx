import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import ActionButton from "../../input/ActionButton";
import { NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
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
        paddingTop: 80,
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
            fontSize: 20,
            lineHeight: 32,
            marginTop: 50,
            marginBottom: 50,
            paddingHorizontal: 48,
            textAlign: "center",
          }}
        >
          Allow notifications on the next screen, to see new grades faster.
        </Text>
        <ActionButton
          type="WHITE"
          onPress={() => {
            Notifications.requestPermissionsAsync().then((result) => {
              props.navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "scorecard",
                    params: {
                      firstTime: true,
                      allowNotifications: result.granted,
                    },
                  },
                ],
              });
            });
          }}
        >
          Continue
        </ActionButton>
        <Text
          style={{
            color: "white",
            fontSize: 16,
            lineHeight: 24,
            marginTop: 50,
            marginBottom: 50,
            paddingHorizontal: 48,
            textAlign: "center",
          }}
        >
          You can customize notifications for each class, and always disable
          them later.{" "}
        </Text>
      </View>
    </View>
  );
}
