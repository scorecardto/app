import React, { forwardRef } from "react";
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
      paddingTop: 10,
      paddingBottom: 40,
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
        returnKeyType={"done"}
      />
    </View>
  );
});
