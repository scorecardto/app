import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SolidChip(props: {
  label: string;
  color?: string;
  textColor?: string;
}) {
  const isNumber = !isNaN(Number(props.label.replace("%", "")));

  const rounded = isNumber
    ? Math.round(Number(props.label)) + "%"
    : props.label;

  return (
    <View style={[styles.wrapper, { backgroundColor: props.color || "#000" }]}>
      <Text style={[styles.text, { color: props.textColor || "#fff" }]}>
        {rounded}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 1000,
  },
  text: {
    color: "#fff",
  },
});
