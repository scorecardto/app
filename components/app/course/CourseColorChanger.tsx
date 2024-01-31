import { View, Text, Keyboard } from "react-native";
import React from "react";
import Color from "../../../lib/Color";
import { useTheme } from "@react-navigation/native";
import SmallText from "../../text/SmallText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
export default function CourseColorChanger(props: {
  value: string;
  onChange: (accentLabel: string) => void;
}) {
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
        Color
      </SmallText>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {Object.entries(Color.AccentsMatrix).map(
          ([accentLabel, colors], index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  props.onChange(accentLabel);
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
                    backgroundColor:
                      colors[theme.dark ? "dark" : "default"].preview,
                  }}
                >
                  {accentLabel === props.value && (
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
              </TouchableOpacity>
            );
          }
        )}
      </View>
    </View>
  );
}
