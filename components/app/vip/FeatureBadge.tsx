import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import MaterialIcon from "@expo/vector-icons/MaterialCommunityIcons";
import SmallText from "../../text/SmallText";
import useIsDarkMode from "../../core/theme/useIsDarkMode";

export default function FeatureBadge(props: {
  icon: string;
  colors: string[];
}) {
  const isDarkMode = useIsDarkMode();

  const iconColor = isDarkMode ? props.colors[1] : props.colors[3];
  const backgroundColor = isDarkMode ? props.colors[0] : props.colors[2];

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: backgroundColor,
      height: 48,
      width: 48,
      borderRadius: 24,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 4,
    },
  });

  return (
    <View style={styles.wrapper}>
      <MaterialIcon
        /* @ts-ignore */
        name={props.icon}
        size={24}
        color={iconColor}
      />
    </View>
  );
}
