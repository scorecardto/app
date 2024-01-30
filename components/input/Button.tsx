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
  }
>((props, ref) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    wrapper: {
      alignSelf: "center",
    },
    button: {
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 5,
      alignSelf: "center",
      backgroundColor: colors.button,
      borderWidth: 1,
      borderBottomWidth: 2,
      borderColor: colors.buttonBorder,
    },
    text: {
      fontSize: 16,
      color: "white",
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
