import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import LargeText from "../../text/LargeText";
import WelcomeScreenBanner from "../welcome/WelcomeScreenBanner";
import MonoText from "../../text/MonoText";
import { useTheme } from "@react-navigation/native";
import AccountSubpageBanner from "./AccountSubpageBanner";

export default function AccountSubpageScreen(props: {
  children: React.ReactNode;
  header: string;
  footerText: string;
  showBanner?: boolean;
  padding?: boolean;
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

  return (
    <View style={styles.wrapper}>
      <View style={styles.top}>
        <AccountSubpageBanner
          show={props.showBanner ?? true}
          padding={props.padding}
        />
        <View style={styles.heading}>
          <LargeText style={styles.header}>{props.header}</LargeText>
        </View>
        <View style={styles.content}>{props.children}</View>
      </View>
    </View>
  );
}
