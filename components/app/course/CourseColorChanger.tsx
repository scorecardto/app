import { View, Text } from "react-native";
import React from "react";
import Color from "../../../lib/Color";
import { useTheme } from "@react-navigation/native";
import SmallText from "../../text/SmallText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
export default function CourseColorChanger() {
  const theme = useTheme();
  return (
    <View>
      <SmallText style={{ fontSize: 16, marginBottom: 8 }}>Color</SmallText>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {Object.entries(Color.AccentsMatrix).map(
          ([accentLabel, colors], index) => {
            return (
              <View
                key={index}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  marginRight: 8,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor:
                    colors[theme.dark ? "dark" : "default"].preview,
                }}
              >
                {accentLabel === theme.accentLabel && (
                  <MaterialIcons
                    name="check"
                    size={20}
                    color={"#FFFFFF"}
                    style={{
                      width: 20,
                      height: 20,
                      textAlign: "center",
                      textAlignVertical: "center",
                      alignSelf: "center",
                      lineHeight: 20,
                    }}
                  />
                )}
              </View>
            );
          }
        )}
      </View>
    </View>
  );
}
