import ReactNative, {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
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
import CleanTextInput from "../../input/CleanTextInput";
import LargeText from "../../text/LargeText";
import OnboardingButtonContainer from "../../app/welcome/OnboardingButtonContainer";
import { Image } from "expo-image";

const icon = require("../../../assets/icon.svg");

export default function VerifyPhoneNumberScreen(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
      }}
    >
      <LoadingOverlay show={loading} />
      <SafeAreaView
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <View style={{ marginHorizontal: 20 }}>
          <View style={{ marginBottom: 48, marginTop: 24 }}>
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Image
                source={icon}
                style={{
                  height: 80,
                  aspectRatio: 1,
                }}
              />
              <MediumText
                style={{
                  color: colors.primary,
                  textAlign: "center",
                  fontSize: 28,
                  marginTop: 24,
                  marginHorizontal: 48,
                }}
              >
                Enter Confirmation Code
              </MediumText>
            </View>
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 24,
            marginBottom: 24,
          }}
        >
          <CleanTextInput
            value={code}
            setValue={setCode}
            label="Code"
            type="confirmationCode"
            autoFocus={true}
          />
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <View
              style={{
                paddingVertical: 12,
                paddingHorizontal: 48,
                marginTop: 8,
                alignSelf: "center",
              }}
            >
              <MediumText
                style={{
                  color: "#509EE7",
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                Change Phone Number
              </MediumText>
            </View>
          </TouchableOpacity>
        </View>
        <OnboardingButtonContainer />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
  // return (
  //   <View
  //     style={{
  //       height: "100%",
  //       width: "100%",
  //     }}
  //   >
  //     <LoadingOverlay show={loading} />
  //     <WelcomeScreen
  //       header={HEADER}
  //       footerText={FOOTER}
  //       showBanner={!isKeyboardVisible}
  //       monoLabel="Step 3.5 of 3"
  //     >
  //       <MediumText style={{ marginBottom: 16, color: colors.primary }}>
  //         We sent a verification code to:
  //       </MediumText>
  //       <SmallText
  //         style={{ marginBottom: 32, fontSize: 16, color: colors.text }}
  //       >
  //         {phoneNumber}
  //       </SmallText>

  //       <View style={{}}>
  //         <TextInput
  //           ref={textInputRef}
  //           label="Verification Code"
  //           setValue={setCode}
  //           value={code}
  //           type="verification-code"
  //         />
  //         {/* <Button
  //           onPress={() => {
  //             confirm();
  //           }}
  //         >
  //           Finish
  //         </Button> */}
  //         <Button
  //           secondary
  //           disabled={loading}
  //           onPress={() => {
  //             props.navigation.goBack();
  //           }}
  //         >
  //           Edit Number
  //         </Button>
  //       </View>
  //     </WelcomeScreen>
  //   </View>
  // );
}
