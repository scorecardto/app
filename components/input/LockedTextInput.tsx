import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import MaterialIcon from "@expo/vector-icons/MaterialCommunityIcons";
export default function LockedTextInput(props: { children: string }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.backgroundNeutral,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 4,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          marginRight: 16,
        }}
      >
        <MaterialIcon name="lock" size={18} color={colors.text} />
      </View>
      <Text
        style={{
          fontSize: 16,
          color: colors.text,
        }}
      >
        {props.children}
      </Text>
    </View>
  );
}
