import { TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { NavigationProp, useTheme } from "@react-navigation/native";
import Button from "../../input/Button";
import { TextInput } from "../../input/TextInput";
import { fetchAllContent } from "../../../lib/fetcher";
import SmallText from "../../text/SmallText";
import useKeyboardVisible from "../../util/hooks/useKeyboardVisible";
import LoadingOverlay from "../loader/LoadingOverlay";
import fetchAndStore from "../../../lib/fetchAndStore";
import AccountSubpageScreen from "../../app/account/AccountSubpageScreen";
import Toast from "react-native-toast-message";
import ReactNative from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../core/state/store";
import * as loginSlice from "../../core/state/user/loginSlice";
import { setOldCourseState } from "../../core/state/grades/oldCourseStatesSlice";
import ScorecardModule from "../../../lib/expoModuleBridge";
const EditConnectAccountScreen = (props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) => {
  const HEADER = "Edit Frontline Login";
  const FOOTER =
    "Your login info and grades are stored on your device and cannot be accessed by Scorecard.";

  const district = props.route.params.district;

  const { accents, colors } = useTheme();

  const isKeyboardVisible = useKeyboardVisible();

  const [username, setUsername] = useState(props.route.params.username ?? "");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const usernameRef = useRef<ReactNative.TextInput>(null);
  const passwordRef = useRef<ReactNative.TextInput>(null);

  const numCourses = useSelector((state: RootState) => state.gradeData.record?.courses.length);
  useEffect(() => {
    if (loading) {
      let schoolLabel = "";
      let gradeLabel = "";
      const reportCard = fetchAllContent(
        district.url,
        numCourses,
        username,
        password,
        (name) => {
          schoolLabel = name.school;
          gradeLabel = name.grade;

          dispatch(loginSlice.setSchoolName(name.school));
          dispatch(loginSlice.setGradeLabel(name.grade));
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
          loginSlice.setDistrict(district.url);
          loginSlice.setUsername(username);
          loginSlice.setPassword(password);
          loginSlice.setDistrictVipProgramDate(district.vipProgramDate);

          ScorecardModule.storeItem(
            "login",
            JSON.stringify({
              host: district.url,
              username,
              password,
              schoolLabel,
              gradeLabel,
            })
          )

          if (district.vipProgramDate) {
              ScorecardModule.storeItem("vipProgramDate", district.vipProgramDate)
          }

          await fetchAndStore(data, dispatch, true);
        })
        .catch((e: Error) => {
          if (e.message === "INCORRECT_PASSWORD") {
            setLoading(false);
            setPassword("");
            Toast.show({
              type: "info",
              text1: "Incorrect password",
              text2:
                "Enter the password you use to log into Frontline. Too many incorrect attempts will lock you out of your account.",
              visibilityTime: 5000,
              position: "top",
            });
            passwordRef.current?.focus();
            return;
          } else if (e.message === "INCORRECT_USERNAME") {
            setLoading(false);
            setUsername("");
            setPassword("");

            Toast.show({
              type: "info",
              text1: "Incorrect username",
              text2: "Enter the username you use to log into Frontline.",
              visibilityTime: 5000,
              position: "top",
            });

            usernameRef.current?.focus();

            return;
          } else {
            setLoading(false);
          }
        });
    }
  }, [loading, username, password, district.url]);

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
              <SmallText
                style={{
                  color: colors.primary,
                }}
              >
                {district.name
                  ? `You're logging with an ${district.name} account.`
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
            ref={usernameRef}
          />
          <TextInput
            label="Password"
            setValue={setPassword}
            value={password}
            type="password"
            ref={passwordRef}
          />
          <Button onPress={() => setLoading(true)}>Login</Button>
        </View>
      </AccountSubpageScreen>
    </View>
  );
};

export default EditConnectAccountScreen;
