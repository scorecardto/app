import { View, Text } from "react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
import AccountSubpageScreen from "../../app/account/AccountSubpageScreen";
import MediumText from "../../text/MediumText";
import { TextInput } from "../../input/TextInput";
import LockedTextInput from "../../input/LockedTextInput";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
import { MobileDataContext } from "../../core/context/MobileDataContext";
import DeleteInput from "../../input/DeleteInput";

import { firebase, FirebaseAuthTypes } from "@react-native-firebase/auth";
export default function GeneralSettingsScreen(props: {
  route: any;
  navigation: any;
}) {
  const { colors } = useTheme();
  const mobileData = useContext(MobileDataContext);

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  const [firstName, setFirstName] = useState(mobileData.firstName);
  const [lastName, setLastName] = useState(mobileData.lastName);

  return (
    <AccountSubpageScreen
      header="General"
      footerText="These are your general settings."
    >
      <View style={{ marginBottom: 12 }}>
        <MediumText style={{ marginBottom: 16, color: colors.primary }}>
          Edit your name
        </MediumText>
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
      </View>

      <View style={{ marginBottom: 36 }}>
        <MediumText style={{ marginBottom: 16, color: colors.primary }}>
          Your phone number
        </MediumText>
        <SmallText style={{ marginBottom: 16, color: colors.text }}>
          To edit, reset your account data.
        </SmallText>
        <LockedTextInput>
          {user?.phoneNumber || "You have not signed in with a phone number."}
        </LockedTextInput>
      </View>
      <MediumText style={{ marginBottom: 16, color: colors.primary }}>
        Reset Account Data
      </MediumText>
      <SmallText style={{ marginBottom: 16, color: colors.text }}>
        This clears data from your device, but does not delete your account.
      </SmallText>
      <DeleteInput onPress={() => {}}>Reset Account Data</DeleteInput>
    </AccountSubpageScreen>
  );
}
