import { Alert, View } from "react-native";
import { useEffect, useState } from "react";
import AccountSubpageScreen from "../../app/account/AccountSubpageScreen";
import MediumText from "../../text/MediumText";
import { TextInput } from "../../input/TextInput";
import LockedTextInput from "../../input/LockedTextInput";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
import DeleteInput from "../../input/DeleteInput";

import { firebase, FirebaseAuthTypes } from "@react-native-firebase/auth";
import Storage from "expo-storage";
import { reloadApp } from "../../../lib/reloadApp";
import * as nameSlice from "../../core/state/user/nameSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../core/state/store";
export default function GeneralSettingsScreen(props: {
  route: any;
  navigation: any;
}) {
  const { colors } = useTheme();

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  const firstNameInitial = useSelector(
    (state: RootState) => state.name.firstName
  );
  const lastNameInitial = useSelector(
    (state: RootState) => state.name.lastName
  );

  const [firstName, setFirstName] = useState(firstNameInitial);
  const [lastName, setLastName] = useState(lastNameInitial);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(nameSlice.setFirstName(firstName));
    dispatch(nameSlice.setLastName(lastName));

    Storage.setItem({
      key: "name",
      value: JSON.stringify({ firstName, lastName }),
    });
  }, [firstName, lastName]);
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
      <DeleteInput
        onPress={async () => {
          Alert.prompt(
            "Reset Local Data",
            "You will need to sign in again to access Scorecard.",
            [
              {
                text: "Cancel",
                style: "cancel",
                isPreferred: true,
              },
              {
                text: "Reset",
                style: "destructive",
                onPress: async () => {
                  for (const key of [
                    "name",
                    "login",
                    "enableGradebookNotifications",
                    "gradebookCheckInterval",
                    "notifs",
                    "records",
                    "settings",
                    "oldCourseStates",
                  ]) {
                    await Storage.removeItem({ key });
                  }

                  firebase.auth().signOut();

                  reloadApp();
                },
              },
            ],
            "default"
          );
        }}
      >
        Reset Account Data
      </DeleteInput>
    </AccountSubpageScreen>
  );
}
