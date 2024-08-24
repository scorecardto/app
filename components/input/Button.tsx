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
const Button = forwardRef<
  View,
  {
    children: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    disabled?: boolean;
    secondary?: boolean;
    small?: boolean;
  }
>((props, ref) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    wrapper: {
      alignSelf: "center",
    },
    button: {
      paddingHorizontal: props.small ? 16 : 32,
      paddingVertical: props.small ? 8 : 14,
      borderRadius: 24,
      alignSelf: "center",
      backgroundColor: props.secondary
        ? colors.backgroundNeutral
        : colors.button,
      opacity: props.disabled ? 0.5 : 1,
    },
    text: {
      fontSize: props.small ? 14 : 16,
      color: props.secondary ? colors.text : "#FFFFFF",
      fontWeight: "500",
    },
  });
  return (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.disabled}
      style={styles.wrapper}
    >
      <View style={styles.button} ref={ref}>
        <Text style={styles.text}>{props.children}</Text>
      </View>
    </TouchableOpacity>
  );
});

export default Button;
