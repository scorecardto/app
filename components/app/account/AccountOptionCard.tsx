import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import SmallText from "../../text/SmallText";
import MaterialIcon from "@expo/vector-icons/MaterialCommunityIcons";

export default function AccountOptionCard(props: {
  label: string;
  icon: string;
  onPress(): void;
}) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    wrapper: {
      marginHorizontal: 12,
      marginBottom: 10,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: colors.card,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconWrapper: {
      width: 52,
      height: 52,
      backgroundColor: colors.text,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    labelWrapper: {
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    label: {
      fontSize: 16,
      color: colors.primary,
    },
  });
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.wrapper}>
        <View style={styles.left}>
          <View style={styles.iconWrapper}>
            {/* @ts-ignore */}
            <MaterialIcon name={props.icon} size={24} color={"#FFF"} />
          </View>
          <View style={styles.labelWrapper}>
            <SmallText style={styles.label}>{props.label}</SmallText>
          </View>
        </View>
        <View></View>
      </View>
    </TouchableOpacity>
  );
}
