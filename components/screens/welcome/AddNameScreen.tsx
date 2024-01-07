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

export default function AddNameScreen(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const HEADER = "Add Your Name";
  const FOOTER = "This will be displayed in place of your name from Frontline.";

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  function finish() {
    Storage.setItem({
      key: "name",
      value: JSON.stringify({
        firstName,
        lastName,
      }),
    }).then(() => {
      props.navigation.reset({
        index: 0,
        routes: [{ name: "scorecard" }],
      });
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
        monoLabel="Finish Setting Up"
      >
        <MediumText style={{ marginBottom: 16 }}>Add your name</MediumText>
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
                setFirstName(v);
              }}
              type="first-name"
            />
          </View>
          <View style={{ width: "100%", flexShrink: 1 }}>
            <TextInput
              label="Last Name"
              value={lastName}
              setValue={(v) => {
                setLastName(v);
              }}
              type="last-name"
            />
          </View>
        </View>
        <Button onPress={finish}>Finish</Button>
      </WelcomeScreen>
    </View>
  );
}
