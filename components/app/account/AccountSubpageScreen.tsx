import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import React from "react";
import LargeText from "../../text/LargeText";
import WelcomeScreenBanner from "../welcome/WelcomeScreenBanner";
import MonoText from "../../text/MonoText";
import { useTheme } from "@react-navigation/native";
import AccountSubpageBanner from "./AccountSubpageBanner";
import useKeyboardVisible from "../../util/hooks/useKeyboardVisible";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

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
      paddingBottom: 24,
    },
    footer: {
      flex: 1,
    },
    header: {
      marginTop: 8,
      fontSize: 28,
      fontWeight: "bold",
      color: colors.primary,
    },
    topScrollHeader: {
      backgroundColor: colors.secondary,
      height: 1000,
      position: "absolute",
      top: -1000,
      left: 0,
      right: 0,
    },
  });

  const usingKeyboard = useKeyboardVisible();

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.top}>
        {Platform.OS === "ios" && <View style={styles.topScrollHeader} />}
        <AccountSubpageBanner
          show={(props.showBanner ?? true) && !usingKeyboard}
          padding={props.padding}
        />
        <View style={styles.heading}>
          <LargeText style={styles.header}>{props.header}</LargeText>
        </View>
        <View style={styles.content}>{props.children}</View>
      </ScrollView>
    </View>
  );
}
