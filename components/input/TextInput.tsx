import React, { forwardRef } from "react";
import { Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import ReactNative from "react-native";
import { StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
export const TextInput = forwardRef<
  ReactNative.TextInput,
  {
    label: string;
    value: string;
    setValue: (text: string) => void;
    type:
      | "username"
      | "text"
      | "password"
      | "phone-number"
      | "first-name"
      | "last-name"
      | "verification-code";
    inputProps?: ReactNative.TextInputProps;
    clearTextOnFocus?: boolean;
    disableMarginBottom?: boolean;
    ignoreValueSync?: boolean;
  }
>((props, ref) => {
  const disableCorrections =
    props.type === "password" ||
    props.type === "username" ||
    props.type === "phone-number";

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
        clearTextOnFocus={props.clearTextOnFocus}
        style={styles.input}
        {...{
          [`${props.ignoreValueSync ? "defaultValue" : "value"}`]: props.value,
        }}
        placeholder={props.label}
        placeholderTextColor={colors.text}
        onChangeText={props.setValue}
        {...(disableCorrections && {
          autoCapitalize: "none",
          autoCorrect: false,
          autoCompleteType: "off",
          textContentType: "none",
          spellCheck: false,
        })}
        {...(props.type === "password" && {
          secureTextEntry: true,
        })}
        returnKeyType={"done"}
        keyboardType={
          props.type === "phone-number"
            ? "phone-pad"
            : props.type === "verification-code"
            ? "number-pad"
            : "default"
        }
        autoComplete={
          props.type === "phone-number"
            ? "tel"
            : props.type === "first-name"
            ? "given-name"
            : props.type === "last-name"
            ? "name-family"
            : "off"
        }
        textContentType={
          props.type === "phone-number"
            ? "telephoneNumber"
            : props.type === "first-name"
            ? "givenName"
            : props.type === "last-name"
            ? "familyName"
            : props.type === "verification-code"
            ? "oneTimeCode"
            : "none"
        }
        {...props.inputProps}
      />
    </View>
  );
});
