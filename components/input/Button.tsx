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
  return (
    <View style={props.style} ref={ref}>
      <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
        <Text style={props.textStyle}>{props.children}</Text>
      </TouchableOpacity>
    </View>
  );
});

const DefaultButtonStyle = StyleSheet.create({
  default: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  defaultText: {
    fontSize: 18,
  },
});

const ButtonStyle = StyleSheet.create({
  black: {
    ...DefaultButtonStyle.default,
    backgroundColor: "black",
  },
});

const ButtonTextStyle = StyleSheet.create({
  white: {
    ...DefaultButtonStyle.defaultText,
    color: "white",
  },
});
export default Button;
export { ButtonStyle, DefaultButtonStyle, ButtonTextStyle };
