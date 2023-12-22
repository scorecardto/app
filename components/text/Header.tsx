import { View, Text, StyleSheet } from "react-native";
import React from "react";
import LargeText from "./LargeText";
import StatusText from "./StatusText";

export default function Header(props: { header: string; subheader: string }) {
  return (
    <View style={styles.container}>
      <LargeText style={styles.header}>{props.header}</LargeText>
      <StatusText style={styles.subheader}>{props.subheader}</StatusText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    marginBottom: 28,
  },
  header: {
    textAlign: "center",
  },
  subheader: {
    marginTop: 14,
    textAlign: "center",
  },
});
