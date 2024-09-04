import { View, Text, TextInput, ReturnKeyType } from "react-native";
import React, { useState } from "react";
import useColors from "../core/theme/useColors";

export default function CleanTextInput(props: {
  label: string;
  value: string;
  setValue(c: string): void;
  returnKeyType?: ReturnKeyType;
  type:
    | "username"
    | "password"
    | "firstName"
    | "lastName"
    | "phoneNumber"
    | "confirmationCode";
  autoFocus?: boolean;
}) {
  const colors = useColors();
  const [focus, setFocus] = useState(false);

  const disableCorrections =
    props.type !== "firstName" && props.type !== "lastName";
  return (
    <View
      style={{
        marginBottom: 20,
      }}
    >
      <Text
        style={{
          letterSpacing: 1,
          fontSize: 14,
          color: focus ? "#509EE7" : colors.text,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {props.label}
      </Text>
      <TextInput
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
        placeholder={""}
        placeholderTextColor={colors.text}
        onChangeText={props.setValue}
        value={props.value}
        style={{
          fontSize: 24,
          color: colors.primary,
          paddingHorizontal: 4,
          paddingBottom: 8,
          borderBottomWidth: 2,
          borderBottomColor: colors.borderNeutral,
        }}
        {...(disableCorrections && {
          autoCapitalize: "none",
          autoCorrect: false,
          autoCompleteType: "off",
          textContentType: "none",
          autoComplete: "off",
          spellCheck: false,
        })}
        {...(props.type === "password" && {
          secureTextEntry: true,
        })}
        returnKeyType={props.returnKeyType || "next"}
        keyboardType={
          props.type === "phoneNumber"
            ? "phone-pad"
            : props.type === "confirmationCode"
            ? "number-pad"
            : "default"
        }
        autoComplete={
          props.type === "phoneNumber"
            ? "tel"
            : props.type === "confirmationCode"
            ? "sms-otp"
            : props.type === "firstName"
            ? "given-name"
            : props.type === "lastName"
            ? "family-name"
            : props.type === "password"
            ? "password"
            : "username"
        }
        textContentType={
          props.type === "username"
            ? "username"
            : props.type === "password"
            ? "password"
            : props.type === "firstName"
            ? "givenName"
            : props.type === "lastName"
            ? "familyName"
            : props.type === "confirmationCode"
            ? "oneTimeCode"
            : props.type === "phoneNumber"
            ? "telephoneNumber"
            : "none"
        }
        autoFocus={props.autoFocus}
      />
    </View>
  );
}
