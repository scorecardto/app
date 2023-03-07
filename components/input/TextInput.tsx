import React, { forwardRef } from "react";
import { Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import ReactNative from "react-native";
import { StyleSheet } from "react-native";

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

  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>{props.label}</Text>
      <ReactNative.TextInput
        ref={ref}
        style={styles.input}
        value={props.value}
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

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  header: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 10,
    fontSize: 20,
  },
});
