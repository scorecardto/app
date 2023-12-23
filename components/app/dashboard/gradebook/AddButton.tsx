import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SFSymbol } from "react-native-sfsymbols";
import { useTheme } from "@react-navigation/native";
export default function AddButton() {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.borderNeutral,
      borderRadius: 100,
    },
  });
  return (
    <View>
      <SFSymbol name="plus" size={24} color="white" />
    </View>
  );
}
