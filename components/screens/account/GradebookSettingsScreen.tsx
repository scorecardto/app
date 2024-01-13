import { View, Text } from "react-native";
import React, { useContext, useState } from "react";
import AccountSubpageScreen from "../../app/account/AccountSubpageScreen";
import MediumText from "../../text/MediumText";
import { TextInput } from "../../input/TextInput";
import LockedTextInput from "../../input/LockedTextInput";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
import { MobileDataContext } from "../../core/context/MobileDataContext";
import DeleteInput from "../../input/DeleteInput";
import LoginInputCard from "../../input/LoginInputCard";
export default function GradebookSettingsScreen(props: {
  route: any;
  navigation: any;
}) {
  const { colors } = useTheme();
  const mobileData = useContext(MobileDataContext);

  const [firstName, setFirstName] = useState(mobileData.firstName);
  const [lastName, setLastName] = useState(mobileData.lastName);

  return (
    <AccountSubpageScreen
      header="Gradebook"
      footerText="These are your general settings."
    >
      <View style={{ marginBottom: 12 }}>
        <MediumText style={{ marginBottom: 16 }}>Edit your login</MediumText>
        <LoginInputCard
          onPressDistrict={() => {}}
          onPressUsername={() => {}}
          onPressPassword={() => {}}
          district={mobileData.district}
          username={mobileData.username}
        />
      </View>
      <View style={{ marginBottom: 36 }}>
        <MediumText style={{ marginBottom: 16 }}>Your phone number</MediumText>
        <SmallText style={{ marginBottom: 16, color: colors.text }}>
          To edit, reset your account data.
        </SmallText>
        <LockedTextInput>+1 (555) 555-5555</LockedTextInput>
      </View>
      <MediumText style={{ marginBottom: 16 }}>Reset Account Data</MediumText>
      <SmallText style={{ marginBottom: 16, color: colors.text }}>
        This clears data from your device, but does not delete your account.
      </SmallText>
      <DeleteInput onPress={() => {}}>Reset Account Data</DeleteInput>
    </AccountSubpageScreen>
  );
}
