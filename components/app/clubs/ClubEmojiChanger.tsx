import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import useColors from "../../core/theme/useColors";
import MediumText from "../../text/MediumText";
import StatusText from "../../text/StatusText";
import { MaterialIcons } from "@expo/vector-icons";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useRef } from "react";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import { useNavigation } from "@react-navigation/native";

export default function ClubEmojiChanger(props: {
  initialValue?: string;
  onChange: (accentLabel: string) => void;
}) {
  const colors = useColors();

  const navigation = useNavigation();
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          // @ts-ignore
          navigation.navigate("pickEmoji", {
            onChange: (e: any) => {
              props.onChange(e.emoji);
            },
          });
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderColor: "rgba(0,0,0,0.1)",
            backgroundColor: colors.secondaryNeutral,
            paddingVertical: 12,
            paddingHorizontal: 8,
            marginBottom: 16,
            marginTop: 24,
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexShrink: 1,
            }}
          >
            <Text style={{ fontSize: 36, marginHorizontal: 10 }}>
              {props.initialValue || "🙂"}
            </Text>
            <View
              style={{
                flexShrink: 1,
              }}
            >
              <MediumText style={{ fontSize: 14, color: colors.primary }}>
                Change Emoji
              </MediumText>
              <StatusText style={{ fontSize: 12, color: colors.text }}>
                Will be used in notifications and as a logo.
              </StatusText>
            </View>
          </View>

          <View
            style={{
              flexShrink: 0,
            }}
          >
            <View style={{ marginLeft: 12 }}>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.text}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}
