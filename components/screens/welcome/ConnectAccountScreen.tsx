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
const ConnectAccountScreen = (props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) => {
  const HEADER = "Login with Frontline";
  const FOOTER =
    "Your login info and grades are stored on your device and cannot be accessed by Scorecard.";

  const district = props.route.params.district;

  const { accents } = useTheme();

  const isKeyboardVisible = useKeyboardVisible();

  const [username, setUsername] = useState("");
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
            routes: [{ name: "addPhoneNumber", params: { name } }],
          });
        }
      );

      reportCard
        .then(async (data) => {
          const gradeCategory =
            Math.max(
              ...data.courses.map(
                (course) => course.grades.filter((g) => g).length
              )
            ) - 1;

          mobileData.setReferer(data.referer);
          mobileData.setSessionId(data.sessionId);
          mobileData.setDistrict(district.url);
          mobileData.setUsername(username);
          mobileData.setPassword(password);

          dataContext.setData({
            courses: data.courses,
            gradeCategory,
            date: Date.now(),
            gradeCategoryNames: data.gradeCategoryNames,
          });

          await Storage.setItem({
            key: "login",
            value: JSON.stringify({
              host: district.url,
              username,
              password,
            }),
          });

          await Storage.setItem({
            key: "data",
            value: JSON.stringify({
              courses: data.courses,
              gradeCategory,
              date: Date.now(),
              gradeCategoryNames: data.gradeCategoryNames,
            }),
          });
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
      <WelcomeScreen
        header={HEADER}
        footerText={FOOTER}
        showBanner={!isKeyboardVisible}
        monoLabel="Step 2 of 3"
      >
        <View>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("selectDistrict");
            }}
          >
            <View>
              <SmallText>
                You're logging with an {district.name} account.
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
      </WelcomeScreen>
    </View>
  );
};

export default ConnectAccountScreen;
