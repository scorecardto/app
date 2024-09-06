import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import MediumText from "../../text/MediumText";
import useColors from "../../core/theme/useColors";
import useKeyboardVisible from "../../util/hooks/useKeyboardVisible";
import Button from "../../input/Button";

export default function ClubEmailPrompt(props: { onFinish(c: string): void }) {
  const colors = useColors();
  const [email, setEmail] = useState("");
  const keyboardVisible = useKeyboardVisible();

  return (
    <BottomSheetView>
      <MediumText
        style={{
          paddingVertical: 12,
          paddingHorizontal: 24,
          width: "100%",
          fontSize: 18,
          color: colors.primary,
        }}
      >
        Add Email to Continue
      </MediumText>
      <BottomSheetTextInput
        keyboardType="email-address"
        textContentType="emailAddress"
        autoCapitalize="none"
        value={email}
        style={{
          fontSize: 20,
          color: colors.primary,
          backgroundColor: colors.textInput,
          marginHorizontal: 16,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
        }}
        placeholder={"hello@example.com"}
        placeholderTextColor={colors.text}
        onChangeText={(v) => {
          setEmail(v);
        }}
        returnKeyType={"done"}
        multiline={false}
        autoFocus={true}
        onEndEditing={() => {
          props.onFinish(email);
        }}
      />
      <View
        style={{
          alignSelf: "flex-start",
          marginHorizontal: 16,
          marginVertical: 16,
        }}
      >
        <Button
          small
          onPress={() => {
            props.onFinish(email);
          }}
        >
          Done
        </Button>
      </View>
    </BottomSheetView>
  );
}
