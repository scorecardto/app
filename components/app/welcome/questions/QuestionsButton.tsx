import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import MediumText from "../../../text/MediumText";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import useColors from "../../../core/theme/useColors";
import BottomSheetContext from "../../../util/BottomSheet/BottomSheetContext";
import QuestionsSheet from "./QuestionsSheet";
export default function QuestionsButton() {
  const colors = useColors();
  const sheets = useContext(BottomSheetContext);
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        paddingBottom: 48,
        left: 32,
        width: "100%",
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
          }}
        >
          <MaterialIcon name="info" size={28} color={colors.text} />
          <MediumText
            style={{
              color: colors.text,
              fontSize: 20,
              marginLeft: 12,
            }}
          >
            Questions
          </MediumText>
        </View>
      </TouchableOpacity>
    </View>
  );
}
