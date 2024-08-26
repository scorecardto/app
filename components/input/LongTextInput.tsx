import React, { forwardRef, useEffect } from "react";
import { Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import ReactNative from "react-native";
import { StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
export const LongTextInput = forwardRef<
  ReactNative.TextInput,
  {
    label: string;
    value: string;
    setValue: (text: string) => void;
    disabled?: boolean;
    allowLineBreak?: boolean;
    disableMarginBottom?: boolean;
  }
>((props, ref) => {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    wrapper: {
      marginBottom: 10,
    },
    header: {
      fontSize: 16,
      marginBottom: 10,
    },
    input: {
      paddingHorizontal: 16,
      paddingTop: props.disableMarginBottom ? 0 : 10,
      paddingBottom: props.allowLineBreak ? 10 : 40,
      backgroundColor: colors.textInput,
      borderRadius: 4,
      marginBottom: 10,
      fontSize: 16,
      lineHeight: 24,
      color: colors.primary,
    },
  });

  return (
    <View style={styles.wrapper}>
      {/* <Text style={styles.header}>{props.label}</Text> */}
      <ReactNative.TextInput
        ref={ref}
        defaultValue={props.value}
        style={styles.input}
        multiline={true}
        placeholder={props.label}
        placeholderTextColor={colors.text}
        onChangeText={(v) => {
          if (!props.disabled) props.setValue(v);
        }}
        editable={!props.disabled}
        returnKeyType={props.allowLineBreak ? "default" : "done"}
        // press button to submit, not to make a new line
        blurOnSubmit={!props.allowLineBreak}
      />
    </View>
  );
});
