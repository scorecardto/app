import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function GradientChip(props: { label: string }) {
  const isNumber = !isNaN(Number(props.label.replace("%", "")));

  const rounded = isNumber
    ? Math.round(Number(props.label.replace("%", ""))) + "%"
    : props.label;

  return (
    <View>
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.wrapper}
      >
        <Text style={styles.text}>{rounded}</Text>
      </LinearGradient>
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
