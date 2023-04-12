import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SolidChip(props: { label: string }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>{props.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginRight: 10,
    backgroundColor: "#000",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 1000,
  },
  text: {
    color: "#fff",
  },
});
