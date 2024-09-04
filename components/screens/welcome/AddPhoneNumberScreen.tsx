import ReactNative, {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { TextInput } from "../../input/TextInput";
import MediumText from "../../text/MediumText";
import auth from "@react-native-firebase/auth";
import { MobileDataContext } from "../../core/context/MobileDataContext";
import { phone } from "phone";
import Toast from "react-native-toast-message";
import LoadingOverlay from "../loader/LoadingOverlay";
import LargeText from "../../text/LargeText";
import useColors from "../../core/theme/useColors";
import { Image } from "expo-image";
import CleanTextInput from "../../input/CleanTextInput";
import OnboardingButtonContainer from "../../app/welcome/OnboardingButtonContainer";

const icon = require("../../../assets/icon.svg");

function AddPhoneNumberScreen(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const colors = useColors();

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
          !formattedPhoneNumber.phoneNumber
        ) {
          setPhoneNumber("");
          phoneNumberRef.current?.focus();

          Toast.show({
            type: "info",
            text1: "Invalid Phone Number",
            text2:
              "Please use a valid phone number. You'll need to verify with a text code.",
          });

          return false;
        }

        auth()
          .signInWithPhoneNumber(formattedPhoneNumber.phoneNumber)
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

  const [allowSkip, setAllowSkip] = useState(false);
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
                }}
              >
                What's your Phone Number?
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
            value={phoneNumber}
            setValue={setPhoneNumber}
            label="Mobile Number"
            type="phoneNumber"
            autoFocus={true}
          />
          <TouchableOpacity
            onPress={() => {
              finish();
            }}
          >
            <View
              style={{
                backgroundColor: "#509EE7",
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
          {allowSkip && (
            <TouchableOpacity
              onPress={() => {
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: "addEmail", params: { firstTime: true } }],
                });
              }}
            >
              <View
                style={{
                  backgroundColor: "#509EE7",
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
                  Skip This
                </LargeText>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <OnboardingButtonContainer />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default AddPhoneNumberScreen;
