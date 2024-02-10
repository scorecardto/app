import { View } from "react-native";
import { useRef } from "react";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import SmallText from "../../text/SmallText";
import useColors from "../../core/theme/useColors";

export default function CourseNameTextInput(props: {
  value: string;
  setValue: (text: string) => void;
  onFinish(): void;
}) {
  const colors = useColors();

  const ref = useRef(null);

  return (
    <View>
      <SmallText
        style={{ fontSize: 16, marginBottom: 8, color: colors.primary }}
      >
        Name
      </SmallText>
      <View
        style={{
          backgroundColor: colors.backgroundNeutral,
          paddingHorizontal: 20,
          alignSelf: "flex-start",
          borderRadius: 8,
          width: "100%",
        }}
      >
        <BottomSheetTextInput
          ref={ref}
          value={props.value}
          onFocus={() => {
            // @ts-ignore
            ref.current?.setNativeProps({
              selection: {
                start: 0,
                end: props.value.length,
              },
            });
          }}
          onChangeText={props.setValue}
          onEndEditing={props.onFinish}
          onBlur={props.onFinish}
          returnKeyType="done"
          textContentType="none"
          autoCorrect={false}
          maxLength={24}
          style={{
            fontSize: 20,
            fontFamily: "DMSans_500Medium",
            color: colors.primary,
            paddingVertical: 16,
          }}
        />
      </View>
    </View>
  );
}
