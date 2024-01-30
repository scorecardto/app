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
export default function ReAddPhoneNumberScreen(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const HEADER = "Login to Scorecard";
  const FOOTER = "We will never send you spam texts or give out your number.";

  const [phoneNumber, setPhoneNumber] = useState("");

  const mobileDataContext = useContext(MobileDataContext);

  const { confirmPhoneNumberCallback, setConfirmPhoneNumberCallback } =
    mobileDataContext;

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
            console.error(err);
            Toast.show({
              type: "info",
              text1: "Error",
              text2: err.message,
            });
          });

        return true;
      }
    });
  }

  const keyboardVisible = useKeyboardVisible();

  const { colors } = useTheme();

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <WelcomeScreen
        header={HEADER}
        footerText={FOOTER}
        showBanner={!keyboardVisible}
        monoLabel="Access Your Scorecard"
      >
        <LoadingOverlay show={loading} />
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
        <Button onPress={finish}>Finish</Button>
      </WelcomeScreen>
    </View>
  );
}
