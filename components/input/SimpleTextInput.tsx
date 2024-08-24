import React, { forwardRef, useEffect } from "react";
import { Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import ReactNative from "react-native";
import { StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
export const SimpleTextInput = forwardRef<
  ReactNative.TextInput,
  {
    label: string;
    value: string;
    setValue: (text: string) => void;
    disabled?: boolean;
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
      paddingHorizontal: 18,
      paddingVertical: 12,
      backgroundColor: colors.textInput,
      borderRadius: 4,
      marginBottom: props.disableMarginBottom ? 0 : 10,
      fontSize: 16,
      // borderColor: colors.borderNeutral,
      // borderWidth: 1,
      // borderBottomWidth: 2,
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
        placeholder={props.label}
        placeholderTextColor={colors.text}
        onChangeText={(v) => {
          if (!props.disabled) props.setValue(v);
        }}
        editable={!props.disabled}
        returnKeyType={"done"}
        multiline={false}
      />
    </View>
  );
});
