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
import ToggleInput from "../../input/ToggleInput";
import Storage from "expo-storage";
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
        <MediumText style={{ marginBottom: 16 }}>Notifications</MediumText>
        <ToggleInput
          label="New Grades"
          value={mobileData.enableGradebookNotifications}
          setValue={(v) => {
            mobileData.setEnableGradebookNotifications(v);
            Storage.setItem({
              key: "enableGradebookNotifications",
              value: v ? "true" : "false",
            });
          }}
        />
      </View>
    </AccountSubpageScreen>
  );
}
