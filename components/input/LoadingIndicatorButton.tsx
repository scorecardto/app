import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { StyleProp } from "react-native";
import { forwardRef } from "react";
import { useTheme } from "@react-navigation/native";
const LoadingIndicatorButton = forwardRef<
  View,
  {
    children: string;
  }
>((props, ref) => {
  const styles = StyleSheet.create({
    wrapper: {
      alignSelf: "center",
      opacity: 0.5,
    },
    button: {
      paddingHorizontal: 32,
      paddingVertical: 14,
      borderRadius: 24,
      alignSelf: "center",
      backgroundColor: "#FFFFFF",
    },
    text: {
      fontSize: 16,
      color: "#000000",
      fontWeight: "500",
    },
  });
  return (
    <View style={styles.wrapper}>
      <View style={styles.button} ref={ref}>
        <Text style={styles.text}>{props.children}</Text>
      </View>
    </View>
  );
});

export default LoadingIndicatorButton;
