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
import SelectInput from "../../input/SelectInput";
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
      <View style={{ marginBottom: 24 }}>
        <MediumText style={{ marginBottom: 16, color: colors.primary }}>
          Edit your login
        </MediumText>
        <LoginInputCard
          onPressDistrict={() => {
            props.navigation.navigate("editDistrict");
          }}
          onPressUsername={() => {
            props.navigation.navigate("editConnectAccount", {
              district: mobileData.district,
            });
          }}
          onPressPassword={() => {
            props.navigation.navigate("editConnectAccount", {
              username: mobileData.username,
              district: mobileData.district,
            });
          }}
          district={mobileData.district}
          username={mobileData.username}
        />
      </View>
      <View style={{ marginBottom: 36 }}>
        <MediumText style={{ marginBottom: 16, color: colors.primary }}>
          Notifications
        </MediumText>
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
      <View style={{ marginBottom: 24 }}>
        <MediumText style={{ marginBottom: 16, color: colors.primary }}>
          Check for New Grades
        </MediumText>
        <SelectInput
          options={[
            {
              label: "Every Morning",
              value: "morning",
            },
            {
              label: "Twice per Day",
              value: "twice",
            },
            {
              label: "Every Three Hours",
              value: "three",
            },
          ]}
          selected={mobileData.gradebookCheckInterval}
          setSelected={(v) => {
            mobileData.setGradebookCheckInterval(v);
            Storage.setItem({
              key: "gradebookCheckInterval",
              value: v,
            });
          }}
        />
      </View>
    </AccountSubpageScreen>
  );
}
