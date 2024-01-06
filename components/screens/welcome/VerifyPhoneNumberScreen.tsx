import { View, Text } from "react-native";
import React, { useContext, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import WelcomeScreen from "../../app/welcome/WelcomeScreen";
import { TextInput } from "../../input/TextInput";
import MediumText from "../../text/MediumText";
import Button from "../../input/Button";
import auth from "@react-native-firebase/auth";
import { MobileDataContext } from "../../core/context/MobileDataContext";

export default function VerifyPhoneNumberScreen(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const HEADER = "Verify Your Number";
  const FOOTER = "We will never send you spam texts or give out your number.";

  const phoneNumber = props.route?.params?.phoneNumber;
  const firstName = props.route?.params?.firstName;
  const lastName = props.route?.params?.lastName;

  const [code, setCode] = useState("");

  const mobileDataContext = useContext(MobileDataContext);
  const { confirmPhoneNumberCallback, setConfirmPhoneNumberCallback } =
    mobileDataContext;
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
        showBanner={true}
        monoLabel="Step 3.5 of 3"
      >
        <MediumText style={{ marginBottom: 16 }}>
          Can you feel it? You're at the very last step.
        </MediumText>
        <MediumText style={{ marginBottom: 16 }}>
          We sent a verification code to your phone number:
        </MediumText>
        <MediumText style={{ marginBottom: 16 }}>{phoneNumber}</MediumText>

        <View style={{}}>
          <TextInput
            label="Verification Code"
            setValue={setCode}
            value={code}
            type="phone-number"
          />
          <Button
            onPress={() => {
              confirmPhoneNumberCallback(code)
                .then?.(() => {
                  props.navigation.reset({
                    index: 0,
                    routes: [{ name: "scorecard" }],
                  });
                })
                .catch?.((err) => {
                  setCode("");
                });
            }}
          >
            Finish
          </Button>
        </View>
      </WelcomeScreen>
    </View>
  );
}
