import { TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import SmallText from "../../text/SmallText";
import useColors from "../../core/theme/useColors";
import StatusText from "../../text/StatusText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function ClubNameTextInput(props: {
  value: string;
  setValue: (text: string) => void;
  label: string;
  description: string;
}) {
  const colors = useColors();

  const ref = useRef(null);

  return (
    <View>
      <SmallText
        style={{ fontSize: 16, marginBottom: 8, color: colors.primary }}
      >
        {props.label}
      </SmallText>
      <View
        style={{
          backgroundColor: colors.backgroundNeutral,
          borderColor: "rgba(0,0,0,0.1)",
          borderWidth: 1,
          paddingHorizontal: 20,
          alignSelf: "flex-start",
          borderRadius: 8,
          width: "100%",
          position: "relative",
        }}
      >
        <TextInput
          ref={ref}
          defaultValue={props.value}
          onFocus={() => {
            // @ts-ignore
            ref.current?.setNativeProps({
              selection: {
                start: 0,
                end: props?.value?.length,
              },
            });
          }}
          onChangeText={props.setValue}
          returnKeyType="done"
          textContentType="none"
          autoCorrect={true}
          maxLength={22}
          style={{
            fontSize: 20,
            fontFamily: "DMSans_500Medium",
            color: colors.primary,
            paddingVertical: 16,
          }}
        />
      </View>
      <SmallText
        style={{
          color: colors.text,
          fontSize: 14,
          marginVertical: 8,
        }}
      >
        {props.description}
      </SmallText>
    </View>
  );
}
