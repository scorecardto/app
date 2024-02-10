import { View } from "react-native";
import React, { useContext, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import WelcomeScreen from "../../app/welcome/WelcomeScreen";
import { TextInput } from "../../input/TextInput";
import MediumText from "../../text/MediumText";
import Button from "../../input/Button";
import { MobileDataContext } from "../../core/context/MobileDataContext";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
import useKeyboardVisible from "../../util/hooks/useKeyboardVisible";
export default function VerifyPhoneNumberScreen(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const HEADER = "Verify Your Number";
  const FOOTER = "We will never send you spam texts or give out your number.";

  const phoneNumber = props.route?.params?.phoneNumber;

  const [code, setCode] = useState("");

  const mobileDataContext = useContext(MobileDataContext);
  const { confirmPhoneNumberCallback } = mobileDataContext;

  const { colors } = useTheme();

  const isKeyboardVisible = useKeyboardVisible();
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
            label="Verification Code"
            setValue={setCode}
            value={code}
            type="verification-code"
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
