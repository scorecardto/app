import {View} from "react-native";
import React, {useContext, useState} from "react";
import {NavigationProp} from "@react-navigation/native";
import WelcomeScreen from "../../app/welcome/WelcomeScreen";
import {TextInput} from "../../input/TextInput";
import MediumText from "../../text/MediumText";
import Button from "../../input/Button";
import auth from "@react-native-firebase/auth";
import {MobileDataContext} from "../../core/context/MobileDataContext";

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

  function finish() {
    auth()
      .signInWithPhoneNumber(phoneNumber)
      .then((confirmation) => {
        setConfirmPhoneNumberCallback(() => {
          return async (c: string) => {
            return confirmation.confirm(c);
          };
        });
        props.navigation.navigate("verifyPhoneNumber", {
          phoneNumber,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
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
        monoLabel="Access Your Scorecard"
      >
        <MediumText style={{ marginBottom: 16 }}>Phone number</MediumText>
        <TextInput
          label="Your Phone Number"
          setValue={setPhoneNumber}
          value={phoneNumber}
          type="phone-number"
        />
        <Button onPress={finish}>Finish</Button>
      </WelcomeScreen>
    </View>
  );
}
