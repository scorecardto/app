import { View } from "react-native";
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
export default function HelpScreen(props: { route: any; navigation: any }) {
  const { colors } = useTheme();

  const reason = props.route.params.reason;

  const headerText = useMemo(() => {
    switch (reason) {
      case "help":
        return "Help";
      case "bug":
        return "Report a Bug";
      case "suggestion":
        return "Suggest a Feature";
      default:
        return "Help";
    }
  }, [reason]);

  const bodyPlaceholder = useMemo(() => {
    switch (reason) {
      case "help":
        return "Ask your question...";
      case "bug":
        return "Report your bug...";
      case "suggestion":
        return "Suggest your feature...";
      default:
        return "Enter your message...";
    }
  }, [reason]);

  const [allowUserContact, setAllowUserContact] = useState(true);

  const [urgent, setUrgent] = useState(false);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [userToken, setUserToken] = useState<string | undefined>(undefined);

  const { firstName, lastName } = useSelector((state: RootState) => state.name);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          setUserToken(idToken);
        });
      }
    });
  });
  useEffect(() => {
    if (loading) {
      if (!userToken) {
        Toast.show({
          type: "info",
          text1: "Error",
          text2: "You must be logged in to send a message.",
        });
      }

      axios
        .post("https://scorecardgrades.com/api/feedback", {
          reason: reason.toUpperCase(),
          firstName: firstName.substring(0, 50),
          lastName: lastName.substring(0, 50),
          message: message.substring(0, 5000),
          respondToMe: allowUserContact,
          urgent: urgent,
          token: userToken,
          repo: "app",
        })
        .then((res) => {
          if (res.data.success) {
            Toast.show({
              type: "info",
              text1: "Feedback Sent",
              text2: "Thanks for improving Scorecard!",
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
          <ToggleInput
            label="Respond to Me (SMS)"
            value={allowUserContact}
            disabled={loading}
            setValue={(v) => {
              setAllowUserContact(v);
            }}
          />
          <SmallText style={{ marginTop: 4, color: colors.text }}>
            Your phone number and name will be shared regardless of this
            setting.
          </SmallText>

          <View style={{ marginTop: 40 }}>
            <LongTextInput
              label={bodyPlaceholder}
              value={message}
              setValue={(v) => {
                setMessage(v);
              }}
              disabled={loading}
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <ToggleInput
              disabled={loading}
              label="This Issue is Urgent"
              value={urgent}
              setValue={(v) => {
                setUrgent(v);
              }}
            />
            <SmallText style={{ marginTop: 4, color: colors.text }}>
              Select if this is preventing you from using Scorecard.
            </SmallText>
          </View>

          <Button
            disabled={loading || !message}
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
