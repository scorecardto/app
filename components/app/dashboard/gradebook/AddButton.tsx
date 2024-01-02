import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";

export default function AddButton(props: {onPress(): void}) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.secondaryNeutral,
      borderRadius: 24,
      width: 40,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  });
  return (
    <TouchableOpacity style={styles.wrapper} onPress={props.onPress}>
      <MaterialIcons
        name="add"
        size={20}
        color={colors.text}
        style={{
          width: 20,
          height: 20,
          textAlign: "center",
          textAlignVertical: "center",
          alignSelf: "center",
          lineHeight: 20,
        }}
      />
    </TouchableOpacity>
  );
}
