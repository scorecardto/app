import { Text, TouchableOpacity, View } from "react-native";
import ReactNative from "react-native";
import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet } from "react-native";
import Button from "../../input/Button";
import { useRef } from "react";
import { TextInput } from "../../input/TextInput";
import { useEffect } from "react";
import { fetchAllContent, fetchReportCard } from "../../../lib/fetcher";
import { MobileDataContext } from "../../core/context/MobileDataContext";
import { DataContext, GradebookRecord } from "scorecard-types";
import Storage from "expo-storage";
import WelcomeScreenBanner from "../../app/welcome/WelcomeScreenBanner";
import WelcomeScreen from "../../app/welcome/WelcomeScreen";
import { useTheme } from "@react-navigation/native";
import SmallText from "../../text/SmallText";
import useKeyboardVisible from "../../util/hooks/useKeyboardVisible";
import LoadingOverlay from "../loader/LoadingOverlay";
import fetchAndStore from "../../../lib/fetchAndStore";
import AccountSubpageScreen from "../../app/account/AccountSubpageScreen";
const EditConnectAccountScreen = (props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) => {
  const HEADER = "Edit Frontline Login";
  const FOOTER =
    "Your login info and grades are stored on your device and cannot be accessed by Scorecard.";

  const district = props.route.params.district;

  const { accents } = useTheme();

  const isKeyboardVisible = useKeyboardVisible();

  const [username, setUsername] = useState(props.route.params.username ?? "");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const dataContext = React.useContext(DataContext);
  const mobileData = React.useContext(MobileDataContext);

  useEffect(() => {
    if (loading) {
      const reportCard = fetchAllContent(
        district.url,
        username,
        password,
        (name) => {
          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: "addName",
                params: {
                  firstName: name.firstName,
                  lastName: name.lastName,
                },
              },
            ],
          });
        }
      );

      reportCard
        .then(async (data) => {
          mobileData.setDistrict(district.url);
          mobileData.setUsername(username);
          mobileData.setPassword(password);

          await Storage.setItem({
            key: "login",
            value: JSON.stringify({
              host: district.url,
              username,
              password,
            }),
          });

          await fetchAndStore(data, mobileData, dataContext, false);
        })
        .catch((e) => {
          console.error(e);

          setLoading(false);
          alert("Invalid credentials");
        });
    }
  }, [loading]);

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <LoadingOverlay show={loading} />
      <AccountSubpageScreen
        header={HEADER}
        footerText={FOOTER}
        showBanner={!isKeyboardVisible}
      >
        <View>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("editDistrict");
            }}
          >
            <View>
              <SmallText>
                {district.name
                  ? `You're logging with an {district.name} account.`
                  : `You're logging in with your existing district.`}
              </SmallText>
              <SmallText
                style={{
                  marginTop: 4,
                  marginBottom: 36,
                  color: accents.primary,
                  fontWeight: "600",
                  textDecorationLine: "underline",
                }}
              >
                Edit your district.
              </SmallText>
            </View>
          </TouchableOpacity>
          <TextInput
            label="Username"
            setValue={setUsername}
            value={username}
            type="username"
          />
          <TextInput
            label="Password"
            setValue={setPassword}
            value={password}
            type="password"
          />
          <Button onPress={() => setLoading(true)}>Login</Button>
        </View>
      </AccountSubpageScreen>
    </View>
  );
};

export default EditConnectAccountScreen;
