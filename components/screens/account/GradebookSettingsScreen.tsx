import { View } from "react-native";
import AccountSubpageScreen from "../../app/account/AccountSubpageScreen";
import MediumText from "../../text/MediumText";
import { useTheme } from "@react-navigation/native";
import LoginInputCard from "../../input/LoginInputCard";
import { useSelector } from "react-redux";
import { RootState, store } from "../../core/state/store";

export default function GradebookSettingsScreen(props: {
  route: any;
  navigation: any;
}) {
  const { colors } = useTheme();

  const district = useSelector((state: RootState) => state.login.district);
  const username = useSelector((state: RootState) => state.login.username);

  console.log(store.getState());

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
              district: {
                url: district,
              },
            });
          }}
          onPressPassword={() => {
            props.navigation.navigate("editConnectAccount", {
              username: username,
              district: {
                url: district,
              },
            });
          }}
          district={district}
          username={username}
        />
      </View>
      {/* <View style={{ marginBottom: 36 }}>
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
      </View> */}
    </AccountSubpageScreen>
  );
}
