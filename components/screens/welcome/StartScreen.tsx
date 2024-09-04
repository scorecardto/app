import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import ActionButton from "../../input/ActionButton";
import { NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import LargeText from "../../text/LargeText";
import axios from "redaxios";

const icon = require("../../../assets/icon.svg");

export default function StartScreen(props: {
  route: any;
  navigation: NavigationProp<any, any>;
}) {
  const insets = useSafeAreaInsets();

  const DEFAULT_NAME = "Austin ISD";

  const [primaryDistrict, setPrimaryDistrict] = useState<any>(undefined);
  useEffect(() => {
    try {
      axios
        .get("https://scorecardgrades.com/api/districts")
        .then((value) => {
          setPrimaryDistrict(value.data.districts.find((d: any) => d.pinned));
        })
        .catch((e) => {
          setPrimaryDistrict(null);
        });
    } catch (e) {
      setPrimaryDistrict(null);
    }
  }, []);
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
          <LargeText
            style={{
              color: "white",
              fontSize: 28,
            }}
          >
            Welcome to Scorecard
          </LargeText>
          <Text
            style={{
              color: "white",
              fontSize: 20,
              lineHeight: 32,
              marginTop: 12,
              marginBottom: 50,
              paddingHorizontal: 48,
              textAlign: "center",
            }}
          >
            Log in to manage your classes and join clubs!
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
        {primaryDistrict !== null && (
          <TouchableOpacity
            onPress={() => {
              if (primaryDistrict) {
                props.navigation.navigate("connectAccount", {
                  district: primaryDistrict,
                });
              } else {
                props.navigation.navigate("selectDistrict");
              }
            }}
          >
            <View
              style={{
                backgroundColor: "#E62654",
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
                  fontWeight: "500",
                  textAlign: "center",
                  color: "#FFFFFF",
                }}
              >
                {primaryDistrict?.name || DEFAULT_NAME}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("selectDistrict");
          }}
        >
          <View
            style={{
              marginTop: 8,
              backgroundColor: "#0F6BA4",
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
                color: "#FFFFFF",
              }}
            >
              {primaryDistrict === null
                ? "Select your District"
                : "Other District"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
