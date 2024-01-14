import { View, Text, StyleSheet } from "react-native";
import React from "react";
import LargeText from "./LargeText";
import StatusText from "./StatusText";
import { useTheme } from "@react-navigation/native";
import HeaderBanner from "./HeaderBanner";

export default function Header(props: {
  header: string;
  subheader?: string;
  children?: React.ReactNode;
}) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginTop: 24,
      marginBottom: 36,
      flexDirection: "column",
      alignItems: "center",
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
    <View>
      <View style={styles.container}>
        <LargeText style={styles.header}>{props.header}</LargeText>
        {props.subheader && (
          <StatusText style={styles.subheader}>{props.subheader}</StatusText>
        )}
        {props.children}
      </View>
    </View>
  );
}
