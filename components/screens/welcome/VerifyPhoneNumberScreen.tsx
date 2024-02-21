import ReactNative, { Keyboard, View } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import WelcomeScreen from "../../app/welcome/WelcomeScreen";
import { TextInput } from "../../input/TextInput";
import MediumText from "../../text/MediumText";
import Button from "../../input/Button";
import { MobileDataContext } from "../../core/context/MobileDataContext";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
import useKeyboardVisible from "../../util/hooks/useKeyboardVisible";
import Toast from "react-native-toast-message";
import LoadingOverlay from "../loader/LoadingOverlay";
import { firebase } from "@react-native-firebase/auth";
import * as Notifications from "expo-notifications";
export default function VerifyPhoneNumberScreen(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const HEADER = "Verify Your Number";
  const FOOTER = "We will never send you spam texts or give out your number.";

  const phoneNumber = props.route?.params?.phoneNumber;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const mobileDataContext = useContext(MobileDataContext);
  const { confirmPhoneNumberCallback } = mobileDataContext;

  const { colors } = useTheme();

  const isKeyboardVisible = useKeyboardVisible();

  const textInputRef = React.useRef<ReactNative.TextInput>(null);

  const confirm = useCallback(() => {
    setLoading(true);
    Keyboard.dismiss();

    confirmPhoneNumberCallback(code)
      .then(() => {
        const currentPage = props.navigation.getState().routes.slice(-1)[0];

        if (currentPage?.name === "verifyPhoneNumber") {
          Notifications.getPermissionsAsync().then((permissions) => {
            if (permissions.canAskAgain || permissions.ios?.status === 0) {
              props.navigation.reset({
                index: 0,
                routes: [{ name: "notifications" }],
              });
            } else {
              props.navigation.reset({
                index: 0,
                routes: [{ name: "scorecard", params: { firstTime: true } }],
              });
            }
          });
        }
      })
      .catch((err) => {
        if (err.code === "auth/invalid-verification-code") {
          setCode("");
          textInputRef.current?.focus();

          Toast.show({
            type: "info",
            text1: "Incorrect code",
            text2:
              "Enter the code we sent to your phone or tap here to edit your number.",
            onPress: () => {
              props.navigation.goBack();
            },
          });
        } else if (err.code && err.message) {
          Toast.show({
            type: "info",
            text1: err.code,
            text2: err.message,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [code, confirmPhoneNumberCallback, props.navigation, loading]);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setLoading(false);
        Notifications.getPermissionsAsync().then((permissions) => {
          if (permissions.canAskAgain || permissions.ios?.status === 0) {
            props.navigation.reset({
              index: 0,
              routes: [{ name: "notifications" }],
            });
          } else {
            props.navigation.reset({
              index: 0,
              routes: [{ name: "scorecard", params: { firstTime: true } }],
            });
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (code.length === 6) {
      confirm();
    }
  }, [code]);
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
        monoLabel="Step 3.5 of 3"
      >
        <MediumText style={{ marginBottom: 16, color: colors.primary }}>
          We sent a verification code to:
        </MediumText>
        <SmallText
          style={{ marginBottom: 32, fontSize: 16, color: colors.text }}
        >
          {phoneNumber}
        </SmallText>

        <View style={{}}>
          <TextInput
            ref={textInputRef}
            label="Verification Code"
            setValue={setCode}
            value={code}
            type="verification-code"
          />
          {/* <Button
            onPress={() => {
              confirm();
            }}
          >
            Finish
          </Button> */}
          <Button
            secondary
            disabled={loading}
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            Edit Number
          </Button>
        </View>
      </WelcomeScreen>
    </View>
  );
}
