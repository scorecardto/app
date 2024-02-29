import { Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@react-navigation/native";
import AccountSubpageScreen from "../app/account/AccountSubpageScreen";
import ToggleInput from "../input/ToggleInput";
import SmallText from "../text/SmallText";
import { LongTextInput } from "../input/LongTextInput";
import Button from "../input/Button";
import axios from "redaxios";
import { firebase } from "@react-native-firebase/auth";
import Toast from "react-native-toast-message";
import LoadingOverlay from "./loader/LoadingOverlay";
import { useSelector } from "react-redux";
import { RootState } from "../core/state/store";
import { TextInput } from "../input/TextInput";
import {getDeviceDescriptor} from "../../lib/deviceInfo";
export default function HelpOnboardingScreen(props: {
  route: any;
  navigation: any;
}) {
  const { colors } = useTheme();

  const headerText = "Contact Us";

  const bodyPlaceholder =
    "Ask a question, report a bug, or anything else. We're here to help!";

  const [contactMethod, setContactMethod] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      axios
        .post("https://scorecardgrades.com/api/feedback", {
          reason: "ONBOARDING",
          device: getDeviceDescriptor(),
          message: message.substring(0, 5000),
          respondToMe: true,
          contactMethod: contactMethod,
          urgent: true,
          type: "anon",
          repo: "app",
        })
        .then((res) => {
          if (res.data.success) {
            Toast.show({
              type: "info",
              text1: "Success",
              text2:
                "You contacted us successfully. We'll get back to you shortly.",
            });
          } else {
            Toast.show({
              type: "info",
              text1: "Error",
              text2:
                "There was an error sending your message: " + res.data.error,
            });
          }
        })
        .catch((err) => {
          Toast.show({
            type: "info",
            text1: "Error",
            text2: "There was an error sending your message",
          });
        })
        .finally(props.navigation.goBack);
    }
  }, [loading]);
  return (
    <>
      <LoadingOverlay show={loading} />
      <AccountSubpageScreen
        header={headerText}
        footerText="Use this form to communicate directly with the Scorecard team."
      >
        <View
          style={{
            opacity: loading ? 0.5 : 1,
          }}
        >
          <View style={{ marginTop: 20 }}>
            <Text
              style={{ color: colors.primary, fontSize: 16, marginBottom: 16 }}
            >
              What is your phone number?
            </Text>
            <TextInput
              label={"(512) 555-5555"}
              value={contactMethod}
              setValue={(v) => {
                setContactMethod(v);
              }}
              type="phone-number"
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text
              style={{ color: colors.primary, fontSize: 16, marginBottom: 16 }}
            >
              Tell us more...
            </Text>
            <LongTextInput
              label={bodyPlaceholder}
              value={message}
              setValue={(v) => {
                setMessage(v);
              }}
              disabled={loading}
            />
          </View>

          <Button
            disabled={loading || !message || !contactMethod}
            onPress={() => {
              setLoading(true);
            }}
          >
            Send
          </Button>
        </View>
      </AccountSubpageScreen>
    </>
  );
}
