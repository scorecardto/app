import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import LargeText from "../../text/LargeText";
import WelcomeScreenBanner from "./WelcomeScreenBanner";
import MonoText from "../../text/MonoText";
import { useTheme } from "@react-navigation/native";

export default function WelcomeScreen(props: {
  children: React.ReactNode;
  header: string;
  footerText: string;
  showBanner?: boolean;
  monoLabel: string;
}) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.card,
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
    },
    heading: {
      paddingTop: 16,
      paddingHorizontal: 32,
    },
    top: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 32,
      paddingTop: 36,
    },
    footer: {
      flex: 1,
    },
    header: {
      marginTop: 8,
      fontSize: 28,
      fontWeight: "bold",
    },
  });

  const windowHeight = Dimensions.get("window").height;

  return (
    <View style={styles.wrapper}>
      <View style={styles.top}>
        <WelcomeScreenBanner
          height={windowHeight / 3}
          show={props.showBanner ?? true}
        />
        <View style={styles.heading}>
          <MonoText style={{ color: colors.text }}>{props.monoLabel}</MonoText>
          <LargeText style={styles.header}>{props.header}</LargeText>
        </View>
        <View style={styles.content}>{props.children}</View>
      </View>
    </View>
  );
}
