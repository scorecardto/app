import { TouchableOpacity, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import SmallText from "../../text/SmallText";
import useColors from "../../core/theme/useColors";
import StatusText from "../../text/StatusText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function CourseNameTextInput(props: {
  value: string;
  setValue: (text: string) => void;
  onFinish(): void;
  hidden: boolean;
  onToggleHidden: (b: boolean) => void;
}) {
  const colors = useColors();

  const ref = useRef(null);

  const [hidden, setHidden] = useState(props.hidden);

  useEffect(() => {
    props.onToggleHidden(hidden);
  }, [hidden]);

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
          position: "relative",
        }}
      >
        <BottomSheetTextInput
          ref={ref}
          defaultValue={props.value}
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
          autoCorrect={true}
          maxLength={22}
          style={{
            fontSize: 20,
            fontFamily: "DMSans_500Medium",
            color: colors.primary,
            paddingVertical: 16,
          }}
        />

        <TouchableOpacity
          style={{
            position: "absolute",
            paddingHorizontal: 20,
            borderRadius: 100,
            right: 0,
            height: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          onPress={() => {
            setHidden(!hidden);
          }}
        >
          <MaterialCommunityIcons
            name={hidden ? "eye-off" : "eye"}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
      <SmallText
        style={{
          color: colors.text,
          fontSize: 14,
          marginVertical: 8,
        }}
      >
        {hidden ? "Hidden in your courses" : "Shown in your courses"}
      </SmallText>
    </View>
  );
}
