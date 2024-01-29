import { View, Text, FlatList } from "react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
import * as Contacts from "expo-contacts";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../text/Header";
import InviteButton from "../app/vip/InviteButton";
import ContactCard from "../app/vip/ContactCard";
import { useTheme } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import AccountSubpageScreen from "../app/account/AccountSubpageScreen";
import ToggleInput from "../input/ToggleInput";
import SmallText from "../text/SmallText";
import { LongTextInput } from "../input/LongTextInput";
import Button from "../input/Button";
import axios from "redaxios";
import { firebase } from "@react-native-firebase/auth";
import Toast from "react-native-toast-message";
import { MobileDataContext } from "../core/context/MobileDataContext";
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

  const [shareLogin, setShareLogin] = useState(false);
  const [urgent, setUrgent] = useState(false);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [userToken, setUserToken] = useState<string | undefined>(undefined);

  const mobileData = useContext(MobileDataContext);
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
          firstName: mobileData.firstName.substring(0, 50),
          lastName: mobileData.lastName.substring(0, 50),
          message: message.substring(0, 5000),
          respondToMe: allowUserContact,
          urgent: urgent,
          ...(shareLogin
            ? {
                username: mobileData.username,
                password: mobileData.password,
                district: mobileData.district,
              }
            : {}),
          token: userToken,
          repo: 'app',
        })
        .then((res) => {
          Toast.show({
            type: "info",
            text1: "Feedback Sent",
            text2: "Thanks for improving Scorecard!",
          });
          props.navigation.goBack();
        })
        .catch((err) => {
          Toast.show({
            type: "info",
            text1: "Error",
            text2: "There was an error sending your message.",
          });
          console.log(err);
        });
    }
  }, [loading]);
  return (
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
          label="Respond to Me"
          value={allowUserContact}
          disabled={loading}
          setValue={(v) => {
            setAllowUserContact(v);
          }}
        />
        <SmallText style={{ marginTop: 4, color: colors.text }}>
          If enabled, we may contact you via text. Your phone number and name
          will be shared regardless of this setting.
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

        <Button
          disabled={loading || !message}
          onPress={() => {
            setLoading(true);
          }}
        >
          Send
        </Button>

        <Text
          style={{
            marginTop: 40,
            marginBottom: 10,
            fontSize: 16,
            textAlign: "center",
            color: colors.text,
          }}
        >
          Other Options
        </Text>
        <View style={{ marginTop: 20 }}>
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
        <View style={{ marginTop: 40 }}>
          <ToggleInput
            disabled={loading}
            label="Share My Login Info"
            value={shareLogin}
            setValue={(v) => {
              setShareLogin(v);
            }}
          />
          <SmallText style={{ marginTop: 4, color: colors.text }}>
            The Scorecard team cannot see your grades without this enabled. If
            your bug involves a grade data issue, you may want to enable this
            option.
          </SmallText>
        </View>
      </View>
    </AccountSubpageScreen>
  );
}
