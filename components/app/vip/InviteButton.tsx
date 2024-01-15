import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import Ionicon from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";

export default function InviteButton(props: {
  enabled: boolean;
  children: string;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    wrapper: {
      height: 60,
      width: "100%",
      borderRadius: 30,
      backgroundColor: props.enabled ? "#1DC027" : colors.text,
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    text: {
      marginLeft: 20,
      fontSize: 20,
      fontWeight: "500",
      color: "#fff",
    },
  });
  if (!props.enabled) {
    return (
      <View style={styles.wrapper}>
        <Ionicon name="chatbubble" size={24} color="#fff" />
        <Text style={styles.text}>{props.children}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.wrapper}>
        <Ionicon name="chatbubble" size={24} color="#fff" />
        <Text style={styles.text}>{props.children}</Text>
      </View>
    </TouchableOpacity>
  );
}
