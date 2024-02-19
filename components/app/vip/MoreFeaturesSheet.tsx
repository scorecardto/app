import { View } from "react-native";
import React, { useEffect } from "react";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import SmallText from "../../text/SmallText";
import {
  NavigationContext,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import BottomSheetButton from "../../input/BottomSheetButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import {
  setInvitedNumbers,
  setOpenInviteSheetDate,
} from "../../core/state/user/invitedNumbersSlice";
import Storage from "expo-storage";
import FeatureBadge from "./FeatureBadge";
import ActionButton from "../../input/ActionButton";
import CountdownButton from "../../input/CountdownButton";

export default function MoreFeaturesSheet(props: { close: () => void }) {
  const navigation = useNavigation();

  const { colors } = useTheme();

  const invitedNumbers = useSelector(
    (s: RootState) => s.invitedNumbers.numbers
  );

  const dispatch = useDispatch();
  useEffect(() => {
    // if (invitedNumbers !== null) {
    //   Storage.removeItem({ key: "invitedNumbers" });
    //   dispatch(setInvitedNumbers(null));
    //   Storage.removeItem({ key: "openInviteSheetDate" });
    //   dispatch(setOpenInviteSheetDate(null));
    // } else
    if (invitedNumbers === null) {
      Storage.setItem({
        key: "invitedNumbers",
        value: JSON.stringify([]),
      });

      Storage.setItem({
        key: "openInviteSheetDate",
        value: new Date().toISOString(),
      });

      dispatch(setInvitedNumbers([]));

      dispatch(setOpenInviteSheetDate(Date.now()));
    }
  }, []);

  return (
    <BottomSheetView>
      <BottomSheetHeader>Coming March 11</BottomSheetHeader>
      <View
        style={{
          paddingHorizontal: 20,
          marginTop: 16,
          marginBottom: 36,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <FeatureBadge
            icon="pencil"
            colors={["#EAF5FF", "#1A76CB", "#EAF5FF", "#1A76CB"]}
          />
          <FeatureBadge
            icon="emoticon-happy"
            colors={["#FFEDF7", "#DF2960", "#FFEDF7", "#DF2960"]}
          />
          <FeatureBadge
            icon="brightness-2"
            colors={["#F6F0FF", "#AA53E0", "#F6F0FF", "#AA53E0"]}
          />
        </View>
        <SmallText
          style={{
            fontSize: 18,
            textAlign: "center",
            marginHorizontal: 20,
            color: colors.text,
            marginTop: 20,
            marginBottom: 24,
          }}
        >
          🤫 You found our secret features! Dark mode, custom colors, and
          renaming classes are coming soon.
        </SmallText>
        <CountdownButton
          forceEnable={true}
          onPress={() => {
            // @ts-ignore;
            navigation.navigate("inviteOthers");
            props.close();
          }}
        />
      </View>
    </BottomSheetView>
  );
}
