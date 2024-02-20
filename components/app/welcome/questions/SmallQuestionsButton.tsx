import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import MediumText from "../../../text/MediumText";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import useColors from "../../../core/theme/useColors";
import BottomSheetContext from "../../../util/BottomSheet/BottomSheetContext";
import QuestionsSheet from "./QuestionsSheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function SmallQuestionsButton() {
  const colors = useColors();
  const sheets = useContext(BottomSheetContext);
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        position: "absolute",
        bottom: 48,
        right: 16,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          sheets?.addSheet(({ close }) => {
            return <QuestionsSheet close={close} />;
          });
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.backgroundNeutral,
            borderRadius: 100,
            padding: 8,
          }}
        >
          <MaterialIcon name="help-outline" size={36} color={colors.text} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
