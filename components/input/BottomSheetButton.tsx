import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import MediumText from "../text/MediumText";
export default function BottomSheetButton(props: {
  label: string;
  onPress: () => void;
  primary: boolean;
}) {
  const { accents } = useTheme();
  const styles = StyleSheet.create({
    wrapper: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: props.primary ? accents.primary : accents.secondary,
    },
    text: {
      fontSize: 16,
      color: props.primary ? "#fff" : accents.primary,
    },
  });
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.wrapper}>
        <MediumText style={styles.text}>{props.label}</MediumText>
      </View>
    </TouchableOpacity>
  );
}
