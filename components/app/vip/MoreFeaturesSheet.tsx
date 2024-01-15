import { View, Text, Keyboard } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import SmallText from "../../text/SmallText";
import {
  NavigationContext,
  NavigationProp,
  useTheme,
} from "@react-navigation/native";
import { Course, DataContext } from "scorecard-types";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import FeatureCard from "./FeatureCard";
import BottomSheetButton from "../../input/BottomSheetButton";
import * as Contacts from "expo-contacts";

export default function MoreFeaturesSheet(props: { close: () => void }) {
  const navigation = React.useContext(NavigationContext);

  const { colors } = useTheme();

  const dataContext = useContext(DataContext);

  return (
    <BottomSheetView>
      <BottomSheetHeader>More Features</BottomSheetHeader>
      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: 16,
          marginTop: 16,
        }}
      >
        <FeatureCard
          label="Notifications"
          description="Grades also auto-refresh more often"
          icon="bell"
          iconColor="#FF5050"
        />
        <FeatureCard
          label="Aesthetics"
          description="Dark mode, custom colors, and custom icons"
          icon="shape"
          iconColor="#B2CB1A"
        />
        <FeatureCard
          label="Rename Classes"
          description="Remove unclear course codes"
          icon="pencil"
          iconColor="#1A76CB"
        />
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 12,
            marginTop: 12,
            marginBottom: 24,
          }}
        >
          <SmallText
            style={{
              color: colors.text,
              marginBottom: 12,
            }}
          >
            Invite 3 friends to Scorecard to unloock
          </SmallText>
          <BottomSheetButton
            onPress={() => {
              navigation?.navigate("inviteOthers", {});
            }}
            label="Send Invites"
            primary={true}
          />
        </View>
        {/* <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <BottomSheetButton
            onPress={() => {}}
            label="Send Invites"
            primary={true}
          />
          <View style={{ width: 12 }} />
          <BottomSheetButton
            onPress={() => {}}
            label="Cancel"
            primary={false}
          />
        </View> */}
      </View>
    </BottomSheetView>
  );
}
