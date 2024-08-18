import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useRef } from "react";
import useColors from "../../core/theme/useColors";
import MediumText from "../../text/MediumText";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import { ActionSheetRef } from "react-native-actions-sheet";
import CreateClubSheet from "./CreateClubSheet";
import ClubNameTextInput from "./ClubNameTextInput";
import { useNavigation } from "@react-navigation/native";

export default function ClubsToolbar() {
  const colors = useColors();
  const navigation = useNavigation();

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginHorizontal: 12,
          marginTop: 8,
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            const screenName = "manageClubs";
            // @ts-ignore
            navigation.navigate(screenName);
          }}
        >
          <View
            style={{
              backgroundColor: colors.button,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 99,
            }}
          >
            <MediumText
              style={{
                color: "#FFFFFF",
                fontSize: 14,
              }}
            >
              Create
            </MediumText>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}
