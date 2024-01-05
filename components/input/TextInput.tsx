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
    type: "username" | "password";
    inputProps?: ReactNative.TextInputProps;
  }
>((props, ref) => {
  const disableCorrections =
    props.type === "password" || props.type === "username";

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
      paddingVertical: 10,
      backgroundColor: colors.backgroundNeutral,
      borderRadius: 4,
      marginBottom: 10,
      fontSize: 16,
      borderColor: colors.borderNeutral,
      borderWidth: 1,
      borderBottomWidth: 2,
      color: colors.primary,
    },
  });

  return (
    <View style={styles.wrapper}>
      {/* <Text style={styles.header}>{props.label}</Text> */}
      <ReactNative.TextInput
        ref={ref}
        style={styles.input}
        value={props.value}
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
        {...props.inputProps}
      />
    </View>
  );
});
