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
import useColors from "../../core/theme/useColors";
import FeatureCard from "./FeatureCard";

export default function FeatureExplanationSheet(props: { close: () => void }) {
  const navigation = useNavigation();

  const colors = useColors();

  return (
    <BottomSheetView>
      <BottomSheetHeader>Welcome to Scorecard VIP!</BottomSheetHeader>
      <View
        style={{
          paddingHorizontal: 20,
          marginTop: 16,
          marginBottom: 36,
        }}
      >
        <FeatureCard
          label="Dark Mode"
          description="You can now use dark mode in Scorecard when your phone is in dark mode."
          icon="brightness-2"
          iconColor="#AA53E0"
        />
        <FeatureCard
          label="Customize"
          description="You can now give classes custom names and colors. Just open a class tap on the header area."
          icon="emoticon-happy"
          iconColor="#DF2960"
        />
        <FeatureCard
          label="Rename Classes"
          description="You can now rename classes. Just open a class tap on the header area."
          icon="pencil"
          iconColor="#1A76CB"
        />
      </View>
    </BottomSheetView>
  );
}
