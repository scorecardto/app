import { View, Text, Keyboard } from "react-native";
import React from "react";
import Color from "../../../lib/Color";
import { useTheme } from "@react-navigation/native";
import SmallText from "../../text/SmallText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
export default function CourseGlyphChanger(props: {
  value?: string;
  onChange: (accentLabel: string) => void;
}) {
  const ICONS = [
    "function-variant",
    "skull",
    "fire",
    "earth",
    "flag",
    "translate",
    "pencil",
    "emoticon-devil",
    "virus",
    "leaf",
    "nuke",
    "atom",
    "food-apple",
    "shape",
    "calculator-variant",
    "console",
  ];

  // const a=  <MaterialCommunityIcons name=""/>;
  const theme = useTheme();
  return (
    <View
      style={{
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <SmallText
        style={{ fontSize: 16, marginBottom: 8, color: theme.colors.primary }}
      >
        Icon
      </SmallText>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {ICONS.map((icon, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                props.onChange(icon);
              }}
              key={index}
            >
              <View
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 5,
                  marginRight: 8,
                  borderColor: "rgba(0,0,0,0.2)",
                  borderWidth: 1,
                  borderBottomWidth: 2,
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: icon === props.value ? "#38405A" : "#F2F2F2",
                }}
              >
                {
                  <MaterialCommunityIcons
                    // @ts-ignore
                    name={icon}
                    size={20}
                    color={icon === props.value ? "#FFFFFF" : "#C0C0C0"}
                    style={{
                      width: 20,
                      height: 20,
                      textAlign: "center",
                      textAlignVertical: "center",
                      alignSelf: "center",
                      lineHeight: 20,
                    }}
                  />
                }
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
