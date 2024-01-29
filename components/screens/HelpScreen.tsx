import { View, Text, FlatList } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
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
  return (
    <AccountSubpageScreen
      header={headerText}
      footerText="Use this form to communicate directly with the Scorecard team."
    >
      <ToggleInput
        label="Respond to Me"
        value={allowUserContact}
        setValue={(v) => {
          setAllowUserContact(v);
        }}
      />
      <SmallText style={{ marginTop: 4, color: colors.text }}>
        If you enable this option, we will text you with questions, answers, or
        follow-ups.
      </SmallText>

      <View style={{ marginTop: 40 }}>
        <LongTextInput label={bodyPlaceholder} value="" setValue={() => {}} />
      </View>

      <Button onPress={() => {}}>Send</Button>

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
    </AccountSubpageScreen>
  );
}
