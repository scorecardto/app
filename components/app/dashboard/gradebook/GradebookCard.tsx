import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import MediumText from "../../../text/MediumText";
import SmallText from "../../../text/SmallText";

export default function GradebookCard(props: {
  title: string;
  children: React.ReactNode;
  bottom: string[];
  buttonAction: () => void;
}) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.card,
      borderRadius: 12,
    },
    header: {
      paddingVertical: 24,
      paddingHorizontal: 24,
    },
    headerText: {
      fontSize: 20,
    },
    footer: {
      marginTop: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 16,
      paddingHorizontal: 24,
    },
    footerLeft: {
      flexDirection: "column",
    },
    footerText: {
      marginTop: 4,
      fontSize: 14,
      color: colors.text,
    },
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <MediumText style={styles.headerText}>{props.title}</MediumText>
      </View>
      {props.children}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          {props.bottom.map((text, idx) => {
            return (
              <React.Fragment key={idx}>
                <SmallText style={styles.footerText}>{text}</SmallText>
              </React.Fragment>
            );
          })}
        </View>
      </View>
    </View>
  );
}
