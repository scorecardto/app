import ReactNative, { TouchableOpacity, View } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { NavigationProp, useTheme } from "@react-navigation/native";
import Button from "../../input/Button";
import { TextInput } from "../../input/TextInput";
import { fetchAllContent } from "../../../lib/fetcher";
import { MobileDataContext } from "../../core/context/MobileDataContext";
import { DataContext } from "scorecard-types";
import Storage from "expo-storage";
import WelcomeScreen from "../../app/welcome/WelcomeScreen";
import SmallText from "../../text/SmallText";
import useKeyboardVisible from "../../util/hooks/useKeyboardVisible";
import LoadingOverlay from "../loader/LoadingOverlay";
import fetchAndStore from "../../../lib/fetchAndStore";
import Toast from "react-native-toast-message";
import * as loginSlice from "../../core/state/user/loginSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../core/state/store";

const ConnectAccountScreen = (props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) => {
  const HEADER = "Login with Frontline";
  const FOOTER =
    "Your login info and grades are stored on your device and cannot be accessed by Scorecard.";

  const district = props.route.params.district;

  const { accents, colors } = useTheme();

  const isKeyboardVisible = useKeyboardVisible();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const dataContext = React.useContext(DataContext);
  const mobileData = React.useContext(MobileDataContext);
  const dispatch = useDispatch<AppDispatch>();

  const usernameRef = useRef<ReactNative.TextInput>(null);
  const passwordRef = useRef<ReactNative.TextInput>(null);

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
          loginSlice.setDistrict(district);
          loginSlice.setUsername(username);
          loginSlice.setPassword(password);

          await Storage.setItem({
            key: "login",
            value: JSON.stringify({
              host: district.url,
              username,
              password,
            }),
          });

          await fetchAndStore(data, dataContext, mobileData, dispatch, true);
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
              <SmallText
                style={{
                  color: colors.primary,
                }}
              >
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
      </WelcomeScreen>
    </View>
  );
};

export default ConnectAccountScreen;
