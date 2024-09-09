import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import * as Notifications from "expo-notifications";
import { useCallback, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import MediumText from "../../text/MediumText";
import LargeText from "../../text/LargeText";
import useColors from "../../core/theme/useColors";
import { Image } from "expo-image";
import CleanTextInput from "../../input/CleanTextInput";
import { useDispatch } from "react-redux";
import { setPreferredEmail } from "../../core/state/social/socialSlice";
import ScorecardModule from "../../../lib/expoModuleBridge";
import { validate } from "email-validator";
import Toast from "react-native-toast-message";
import { reloadApp } from "../../../lib/reloadApp";

const icon = require("../../../assets/icon.svg");

function AddEmailScreen(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const colors = useColors();

  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const isStudentEmail = email.includes("austinisd") || email.includes("stu.a");

  const isEmailValid = validate(email.toLowerCase()) && !isStudentEmail;

  const finish = useCallback(() => {
    if (isEmailValid) {
      dispatch(setPreferredEmail(email.toLowerCase()));
      ScorecardModule.storeItem("preferredEmail", email.toLowerCase());

      Notifications.getPermissionsAsync().then((permissions) => {
        if (permissions.canAskAgain) {
          props.navigation.reset({
            index: 0,
            routes: [{ name: "notifications" }],
          });
        } else {
          reloadApp();
        }
      });
    } else {
      setEmail("");
      Toast.show({
        type: "info",
        text1: "Please use a valid email!",
      });
    }
  }, [email]);
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
                Last Step: Add Your Email
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
            value={email}
            setValue={setEmail}
            label={
              isStudentEmail ? "Use Your Personal Email!" : "Personal Email"
            }
            type="email"
            autoFocus={true}
            error={isStudentEmail}
          />
          <TouchableOpacity
            disabled={!isEmailValid}
            onPress={() => {
              finish();
            }}
          >
            <View
              style={{
                backgroundColor: "#509EE7",
                opacity: isEmailValid ? 1 : 0.5,
                paddingVertical: 12,
                paddingHorizontal: 48,
                marginTop: 8,
                borderRadius: 60,
                alignSelf: "center",
              }}
            >
              <LargeText
                style={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                Continue
              </LargeText>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default AddEmailScreen;
