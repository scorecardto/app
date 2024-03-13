import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import ActionButton from "../../input/ActionButton";
import { NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PrivacySection from "./privacy/PrivacySection";
import LargeText from "../../text/LargeText";
const icon = require("../../../assets/icon.svg");

export default function PrivacyScreen(props: {
  route: any;
  navigation: NavigationProp<any, any>;
}) {
  const { district } = props.route.params;

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
        <LargeText
          style={{
            marginTop: 20,
            color: "#FFFFFF",
          }}
        >
          Privacy Policy
        </LargeText>
        <View style={{ marginBottom: 23 }}>
          <PrivacySection
            title={"Shared Data"}
            // subtitle={"Not connected to your name or number"}
            items={[
              { icon: "clipboard-outline", label: "Classes and School Info" },
              {
                icon: "comment-text-outline",
                label: "Limited Notification Info",
              },
              { icon: "account", label: "Friend Activity" },
              { icon: "google-analytics", label: "Usage Data" },
            ]}
          />
          <PrivacySection
            title={"Private Data"}
            subtitle={(style) => (
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: style.marginLeft,
                  marginRight: style.marginRight,
                }}
              >
                <Text style={{ ...style, marginLeft: 0, marginRight: 0 }}>
                  On device; the Scorecard team&nbsp;
                </Text>
                <Text
                  style={{
                    ...style,
                    color: "#525252",
                    marginLeft: 0,
                    marginRight: 0,
                  }}
                >
                  cannot
                </Text>
                <Text style={{ ...style, marginLeft: 0, marginRight: 0 }}>
                  &nbsp;access
                </Text>
              </View>
            )}
            items={[
              { icon: "key-variant", label: "Frontline Credentials" },
              { icon: "content-save", label: "All Grade Data" },
            ]}
          />
        </View>
        <ActionButton
          type="WHITE"
          onPress={() => {
            props.navigation.navigate("selectDistrict", {
              district,
            });
          }}
        >
          Select Your School
        </ActionButton>
      </View>
    </View>
  );
}
