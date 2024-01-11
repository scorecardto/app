import { View, Text } from "react-native";
import React, { useContext, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import WelcomeScreen from "../../app/welcome/WelcomeScreen";
import { TextInput } from "../../input/TextInput";
import MediumText from "../../text/MediumText";
import Button from "../../input/Button";
import auth from "@react-native-firebase/auth";
import { MobileDataContext } from "../../core/context/MobileDataContext";
import Storage from "expo-storage";
export default function AddPhoneNumberScreen(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const HEADER = "Create Your Scorecard";
  const FOOTER = "We will never send you spam texts or give out your number.";

  const [firstName, setFirstName] = useState(
    props.route?.params?.name?.firstName
  );

  const [modifiedFirstName, setModifiedFirstName] = useState(false);

  const [lastName, setLastName] = useState(props.route?.params?.name?.lastName);

  const [modifiedLastName, setModifiedLastName] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");

  const mobileDataContext = useContext(MobileDataContext);
  const { confirmPhoneNumberCallback, setConfirmPhoneNumberCallback } =
    mobileDataContext;

  function finish() {
    mobileDataContext.setFirstName(firstName);
    mobileDataContext.setLastName(lastName);
    Storage.setItem({
      key: "name",
      value: JSON.stringify({
        firstName,
        lastName,
      }),
    });
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
          name: {
            firstName,
            lastName,
          },
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
        monoLabel="Step 3 of 3"
      >
        <MediumText style={{ marginBottom: 16 }}>Confirm your name</MediumText>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <View style={{ width: "100%", marginRight: 10, flexShrink: 1 }}>
            <TextInput
              label="First Name"
              value={firstName}
              setValue={(v) => {
                setModifiedFirstName(true);
                setFirstName(v);
              }}
              type="first-name"
              clearTextOnFocus={!modifiedFirstName}
            />
          </View>
          <View style={{ width: "100%", flexShrink: 1 }}>
            <TextInput
              label="Last Name"
              value={lastName}
              setValue={(v) => {
                setModifiedLastName(true);
                setLastName(v);
              }}
              type="last-name"
              clearTextOnFocus={!modifiedLastName}
            />
          </View>
        </View>
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
