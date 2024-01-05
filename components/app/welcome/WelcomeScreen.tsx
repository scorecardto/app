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
}) {
  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      marginTop: props.showBanner ? 0 : 60,
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
      fontSize: 32,
      fontWeight: "bold",
    },
  });

  const windowHeight = Dimensions.get("window").height;

  const { colors } = useTheme();
  return (
    <View style={styles.wrapper}>
      <View style={styles.top}>
        {props.showBanner && <WelcomeScreenBanner height={windowHeight / 3} />}
        <View style={styles.heading}>
          <MonoText style={{ color: colors.text }}>Step 1 of 3</MonoText>
          <LargeText style={styles.header}>{props.header}</LargeText>
        </View>
        <View style={styles.content}>{props.children}</View>
      </View>
    </View>
  );
}
