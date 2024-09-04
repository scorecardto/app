import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import WelcomeScreen from "../../app/welcome/WelcomeScreen";
import { TextInput } from "../../input/TextInput";
import MediumText from "../../text/MediumText";
import Button from "../../input/Button";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../core/state/store";
import * as nameSlice from "../../core/state/user/nameSlice";
import ScorecardModule from "../../../lib/expoModuleBridge";
import LargeText from "../../text/LargeText";
import CleanTextInput from "../../input/CleanTextInput";
import OnboardingButtonContainer from "../../app/welcome/OnboardingButtonContainer";

export default function AddNameScreen(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const { colors } = useTheme();
  const HEADER = props.route.params.editing
    ? "Edit Your Name"
    : "Add Your Name";
  const FOOTER = "This will be displayed in place of your name from Frontline.";

  const [firstName, setFirstName] = useState(
    props.route.params.firstName ?? ""
  );

  const [lastName, setLastName] = useState(props.route.params.lastName ?? "");

  const dispatch = useDispatch<AppDispatch>();

  function finish() {
    dispatch(nameSlice.setFirstName(firstName));
    dispatch(nameSlice.setLastName(lastName));

    ScorecardModule.storeItem(
      "name",
      JSON.stringify({
        firstName,
        lastName,
      })
    );
    props.navigation.navigate("addPhoneNumber");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
      }}
    >
      <SafeAreaView
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <View style={{ marginHorizontal: 24 }}>
          <View style={{ marginBottom: 48, paddingTop: 8 }}>
            <Text
              style={{
                fontSize: 56,
                textAlign: "center",
              }}
            >
              🪐
            </Text>
            <LargeText
              style={{
                fontSize: 28,
                marginTop: 10,
                textAlign: "center",
                color: colors.primary,
              }}
            >
              Confirm your Info
            </LargeText>
          </View>
          <CleanTextInput
            label="First Name"
            value={firstName}
            setValue={setFirstName}
            returnKeyType="next"
            type="firstName"
            autoFocus={true}
          />
          <CleanTextInput
            label="Last Name"
            value={lastName}
            setValue={setLastName}
            type="lastName"
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            finish();
          }}
        >
          <View
            style={{
              backgroundColor: "#509EE7",
              paddingVertical: 16,
            }}
          >
            <LargeText
              style={{
                color: "#FFFFFF",
                fontSize: 20,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Done
            </LargeText>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
