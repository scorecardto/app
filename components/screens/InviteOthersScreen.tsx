import { View, Text } from "react-native";
import React, { useEffect } from "react";
import * as Contacts from "expo-contacts";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../text/Header";
import InviteButton from "../app/vip/InviteButton";

export default function InviteOthersScreen() {
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          const contact = data[0];
          console.log(contact);
        }
      }
    })();
  }, []);

  return (
    <SafeAreaView>
      <Header header="Select 3 People" />
      <View style={{ padding: 32 }}>
        <InviteButton enabled={false}>Invite</InviteButton>
      </View>
    </SafeAreaView>
  );
}
