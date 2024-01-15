import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";
import SmallText from "../../text/SmallText";

export default function FeatureCard(props: {
  label: string;
  description: string;
  icon: string;
  iconColor: string;
}) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.backgroundNeutral,
      borderRadius: 8,
      marginBottom: 8,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    iconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: props.iconColor,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 18,
    },
    textContent: {
      flex: 1,
    },
    label: {
      fontSize: 16,
      color: colors.primary,
      marginBottom: 4,
    },
    description: {
      fontSize: 16,
      color: colors.text,
    },
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcon
          /* @ts-ignore */
          name={props.icon}
          size={18}
          color={"#fff"}
        />
      </View>
      <View style={styles.textContent}>
        <SmallText style={styles.label}>{props.label}</SmallText>
        <SmallText style={styles.description}>{props.description}</SmallText>
      </View>
    </View>
  );
}
