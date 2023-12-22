import { View, Text, StyleSheet } from "react-native";
import React from "react";
import LargeText from "./LargeText";
import StatusText from "./StatusText";
import { useTheme } from "@react-navigation/native";

export default function Header(props: { header: string; subheader?: string }) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginTop: 84,
      marginBottom: 42,
    },
    header: {
      textAlign: "center",
      color: colors.primary,
    },
    subheader: {
      marginTop: 14,
      textAlign: "center",
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <LargeText style={styles.header}>{props.header}</LargeText>
      {props.subheader && (
        <StatusText style={styles.subheader}>{props.subheader}</StatusText>
      )}
    </View>
  );
}
