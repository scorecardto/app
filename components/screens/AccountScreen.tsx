import { TouchableOpacity, View } from "react-native";
import ReactNative from "react-native";
import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet } from "react-native";
import Button, { ButtonStyle, ButtonTextStyle } from "../input/Button";
import { useRef } from "react";
import { TextInput } from "../input/TextInput";
import { useEffect } from "react";
import { fetchAllContent, fetchReportCard } from "../../lib/fetcher";
import { MobileDataContext } from "../core/context/MobileDataContext";
import { DataContext, GradebookRecord } from "scorecard-types";
import { Storage } from "expo-storage";

const AccountScreen = (props: { navigation: NavigationProp<any, any> }) => {
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const urlRef = useRef<ReactNative.TextInput>();
  const usernameRef = useRef<ReactNative.TextInput>();
  const passwordRef = useRef<ReactNative.TextInput>();
  const buttonRef = useRef<View>();

  const [loading, setLoading] = useState(false);

  const dataContext = React.useContext(DataContext);
  const mobileData = React.useContext(MobileDataContext);

  useEffect(() => {
    const opacity = loading ? 0.5 : 1;

    urlRef.current.setNativeProps({ opacity });
    usernameRef.current.setNativeProps({ opacity });
    passwordRef.current.setNativeProps({ opacity });

    buttonRef.current.setNativeProps({ opacity });

    if (loading) {
      const reportCard = fetchAllContent(url, username, password);

      reportCard.then(async (data) => {
        const gradeCategory =
          Math.max(
            ...data.courses.map(
              (course) => course.grades.filter((g) => g).length
            )
          ) - 1;

        mobileData.setReferer(data.referer);
        mobileData.setSessionId(data.sessionId);
        mobileData.setDistrict(url);
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
            host: url,
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

        props.navigation.navigate("scorecard");
      });
    }
  }, [loading]);

  return (
    <View>
      <View>
        <TextInput
          label="Frontline URL"
          value={url}
          setValue={setUrl}
          type="username"
          ref={urlRef}
          inputProps={{
            returnKeyType: "next",
            editable: !loading,
            onSubmitEditing(e) {
              usernameRef.current.focus();
            },
          }}
        />
        <TextInput
          ref={usernameRef}
          label="Username"
          value={username}
          setValue={setUsername}
          type="username"
          inputProps={{
            returnKeyType: "next",
            editable: !loading,
            onSubmitEditing(e) {
              passwordRef.current.focus();
            },
          }}
        />
        <TextInput
          ref={passwordRef}
          label="Password"
          value={password}
          setValue={setPassword}
          type="password"
          inputProps={{
            returnKeyType: "done",
            editable: !loading,
            onSubmitEditing(e) {
              setLoading(true);
            },
          }}
        />
        <Button
          style={ButtonStyle.black}
          textStyle={ButtonTextStyle.white}
          ref={buttonRef}
          disabled={loading}
          onPress={() => {
            setLoading(true);
          }}
        >
          Continue
        </Button>
      </View>
    </View>
  );
};

export default AccountScreen;
