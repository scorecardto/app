import ReactNative, { View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import WelcomeScreen from "../../app/welcome/WelcomeScreen";
import { TextInput } from "../../input/TextInput";
import MediumText from "../../text/MediumText";
import Button from "../../input/Button";
import auth, { firebase } from "@react-native-firebase/auth";
import { MobileDataContext } from "../../core/context/MobileDataContext";
import Storage from "expo-storage";
import { phone } from "phone";
import Toast from "react-native-toast-message";
import useKeyboardVisible from "../../util/hooks/useKeyboardVisible";
import { useTheme } from "@react-navigation/native";
import LoadingOverlay from "../loader/LoadingOverlay";
import * as nameSlice from "../../core/state/user/nameSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../core/state/store";
import * as Notifications from "expo-notifications";
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
  const { setConfirmPhoneNumberCallback } = mobileDataContext;

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const phoneNumberRef = React.useRef<ReactNative.TextInput>(null);
  function finish() {
    setLoading((l) => {
      if (l) return l;
      else {
        dispatch(nameSlice.setFirstName(firstName));
        dispatch(nameSlice.setLastName(lastName));
        Storage.setItem({
          key: "name",
          value: JSON.stringify({
            firstName,
            lastName,
          }),
        });

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
              name: {
                firstName,
                lastName,
              },
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

  const { colors } = useTheme();

  const keyboardVisible = useKeyboardVisible();

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
        monoLabel="Step 3 of 3"
      >
        <MediumText style={{ marginBottom: 16, color: colors.primary }}>
          Confirm your name
        </MediumText>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            marginBottom: 12,
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
        <MediumText style={{ marginBottom: 16, color: colors.primary }}>
          Add your phone number
        </MediumText>
        <TextInput
          label="Your Phone Number"
          setValue={setPhoneNumber}
          value={phoneNumber}
          ref={phoneNumberRef}
          type="phone-number"
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
