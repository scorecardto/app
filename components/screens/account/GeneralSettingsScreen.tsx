import { View, Text } from "react-native";
import React, { useState } from "react";
import AccountSubpageScreen from "../../app/account/AccountSubpageScreen";
import MediumText from "../../text/MediumText";
import { TextInput } from "../../input/TextInput";
import LockedTextInput from "../../input/LockedTextInput";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
export default function GeneralSettingsScreen(props: {
  route: any;
  navigation: any;
}) {
  const { colors } = useTheme();
  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");
  return (
    <AccountSubpageScreen
      header="General"
      footerText="These are your general settings."
    >
      <MediumText style={{ marginBottom: 16 }}>Edit your name</MediumText>
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View style={{ width: "100%", marginRight: 10, flexShrink: 1 }}>
          <TextInput
            label="First Name"
            value={firstName}
            setValue={(v) => {
              setFirstName(v);
            }}
            type="first-name"
          />
        </View>
        <View style={{ width: "100%", flexShrink: 1 }}>
          <TextInput
            label="Last Name"
            value={lastName}
            setValue={(v) => {
              setLastName(v);
            }}
            type="last-name"
          />
        </View>
      </View>

      <MediumText style={{ marginBottom: 16 }}>Your phone number</MediumText>
      <SmallText style={{ marginBottom: 16, color: colors.text }}>
        To edit, reset your account data.
      </SmallText>
      <LockedTextInput>+1 (555) 555-5555</LockedTextInput>

      <MediumText style={{ marginBottom: 16 }}>Reset Account Data</MediumText>
      <SmallText style={{ marginBottom: 16, color: colors.text }}>
        Resetting your account data will clear your Frontline login, all
        personal info, and saved grades from your device. Some non-Frontline
        info may be kept by Scorecard, such as your phone number.
      </SmallText>
    </AccountSubpageScreen>
  );
}
