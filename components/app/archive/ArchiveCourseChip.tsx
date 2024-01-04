import React from "react";
import { Text, View } from "react-native";
import color from "../../../lib/Color";
import { useTheme } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialCommunityIcons";
export default function ArchiveCourseChip(props: {
  accentColorLabel: string;
  grade: string;
  active: boolean;
}) {
  const { dark } = useTheme();
  const accents =
    color.AccentsMatrix[props.accentColorLabel][dark ? "dark" : "default"];

  return (
    <View
      style={{
        backgroundColor: props.active ? accents.primary : accents.secondary,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingTop: 4,
        marginRight: 8,
        alignSelf: "flex-start",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: props.active ? "#fff" : accents.primary,
          fontFamily: "AnekKannada_400Regular",
          alignSelf: "flex-start",
        }}
      >
        {props.grade}
      </Text>
      {!props.active && (
        <View
          style={{
            marginBottom: 5,
            marginLeft: 5,
          }}
        >
          <MaterialIcons name="check" size={16} color={accents.primary} />
        </View>
      )}
    </View>
  );
}
