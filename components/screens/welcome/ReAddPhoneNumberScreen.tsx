import { View } from "react-native";
import React, { useContext, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import WelcomeScreen from "../../app/welcome/WelcomeScreen";
import { TextInput } from "../../input/TextInput";
import MediumText from "../../text/MediumText";
import Button from "../../input/Button";
import auth from "@react-native-firebase/auth";
import { MobileDataContext } from "../../core/context/MobileDataContext";
import phone from "phone";
import ReactNative from "react-native";
import Toast from "react-native-toast-message";
import useKeyboardVisible from "../../util/hooks/useKeyboardVisible";
import { useTheme } from "@react-navigation/native";
import LoadingOverlay from "../loader/LoadingOverlay";
import * as Notifications from "expo-notifications";
export default function ReAddPhoneNumberScreen(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const HEADER = "Login to Scorecard";
  const FOOTER = "We will never send you spam texts or give out your number.";

  const [phoneNumber, setPhoneNumber] = useState("");

  const mobileDataContext = useContext(MobileDataContext);

  const { setConfirmPhoneNumberCallback } = mobileDataContext;

  const [loading, setLoading] = useState(false);

  const phoneNumberRef = React.useRef<ReactNative.TextInput>(null);

  function finish() {
    setLoading((l) => {
      if (l) return l;
      else {
        const formattedPhoneNumber = phone(phoneNumber);

        if (
          !formattedPhoneNumber.isValid ||
          !formattedPhoneNumber.phoneNumber ||
          formattedPhoneNumber.phoneNumber == null
        ) {
          setPhoneNumber("");
          phoneNumberRef.current?.focus();

          Toast.show({
            type: "info",
            text1: "Invalid Phone Number",
            text2:
              "Please use a valid phone number. You'll need to verify with a text code.",
          });
        }

        auth()
          .signInWithPhoneNumber(formattedPhoneNumber.phoneNumber!)
          .then((confirmation) => {
            setConfirmPhoneNumberCallback(() => {
              return async (c: string) => {
                return confirmation.confirm(c);
              };
            });
            props.navigation.navigate("verifyPhoneNumber", {
              phoneNumber,
            });
            setLoading(false);
          })
          .catch((err) => {
            if (err.message.startsWith("[auth/missing-phone-number]")) {
              Toast.show({
                type: "info",
                text1: "Error",
                text2: "Please enter a valid phone number.",
              });
              setTimeout(() => {
                setLoading(false);
              }, 500);
            } else if (err.message.startsWith("[auth/popup-closed-by-user]")) {
              Toast.show({
                type: "info",
                text1: "Error",
                text2: "Please complete the popup activity.",
              });
              setTimeout(() => {
                setLoading(false);
              }, 500);
            } else {
              console.error(err);
              Toast.show({
                type: "info",
                text1: "Error",
                text2: err.message,
              });
              setTimeout(() => {
                setLoading(false);
                setAllowSkip(true);
              }, 2500);
            }
          });

        return true;
      }
    });
  }

  const keyboardVisible = useKeyboardVisible();

  const { colors } = useTheme();

  const [allowSkip, setAllowSkip] = useState(false);
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
        showBanner={!keyboardVisible}
        monoLabel="Access Your Scorecard"
      >
        <MediumText style={{ marginBottom: 16, color: colors.primary }}>
          Phone number
        </MediumText>
        <TextInput
          label="Your Phone Number"
          setValue={setPhoneNumber}
          value={phoneNumber}
          type="phone-number"
          ref={phoneNumberRef}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Button onPress={finish}>Finish</Button>

          {allowSkip && (
            <>
              <View style={{ width: 12 }} />
              <Button
                onPress={() => {
                  Notifications.getPermissionsAsync().then((permissions) => {
                    if (permissions.canAskAgain) {
                      props.navigation.reset({
                        index: 0,
                        routes: [{ name: "notifications" }],
                      });
                    } else {
                      props.navigation.reset({
                        index: 0,
                        routes: [
                          { name: "scorecard", params: { firstTime: true } },
                        ],
                      });
                    }
                  });
                }}
                secondary
              >
                Skip This
              </Button>
            </>
          )}
        </View>
      </WelcomeScreen>
    </View>
  );
}
