import { View, Text } from "react-native";
import React, { useRef } from "react";
import { useTheme } from "@react-navigation/native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import SmallText from "../../text/SmallText";

export default function CourseNameTextInput(props: {
  value: string;
  setValue: (text: string) => void;
  onFinish(): void;
}) {
  const { colors } = useTheme();

  const ref = useRef(null);
  return (
    <View>
      <SmallText style={{ fontSize: 16, marginBottom: 8 }}>Name</SmallText>
      <View
        style={{
          backgroundColor: colors.backgroundNeutral,
          paddingHorizontal: 20,
          paddingVertical: 16,
          alignSelf: "flex-start",
          borderRadius: 8,
          width: "100%",
        }}
      >
        <BottomSheetTextInput
          ref={ref}
          value={props.value}
          onFocus={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          onChangeText={(t) => {
            props.setValue(t);
          }}
          onEndEditing={props.onFinish}
          keyboardType="numbers-and-punctuation"
          returnKeyType="done"
          textContentType="none"
          autoCorrect={false}
          maxLength={7}
          style={{
            fontSize: 24,
            fontFamily: "DMSans_500Medium",
          }}
        />
      </View>
    </View>
  );
}
