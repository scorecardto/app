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
    buttonStyle?: 'tiny' | 'small' | 'normal';
  }
>((props, ref) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    wrapper: {
      alignSelf: "center",
    },
    button: {
      paddingHorizontal: props.buttonStyle == 'tiny' ? 16 : props.buttonStyle == 'small' ? 24 : 32,
      paddingVertical: props.buttonStyle == 'tiny' ? 8 : props.buttonStyle == 'small' ? 11 : 14,
      borderRadius: 24,
      alignSelf: "center",
      backgroundColor: props.secondary
        ? colors.backgroundNeutral
        : colors.button,
      opacity: props.disabled ? 0.5 : 1,
    },
    text: {
      fontSize: props.buttonStyle == 'tiny' ? 14 : props.buttonStyle == 'small' ? 15 : 16,
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
