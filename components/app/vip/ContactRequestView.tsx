import { View, Text } from "react-native";
import React, { useEffect } from "react";
import InviteFlowHeader from "./InviteFlowHeader";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
export default function ContactRequestView() {
  return (
    <View
      style={{
        height: "100%",
        justifyContent: "space-between",
        backgroundColor: "#1AB762",
      }}
    >
      <InviteFlowHeader
        header="Select Person 1"
        subheader="then, send them a link"
      />
      <MaterialIcon
        name="account-circle"
        size={192}
        color="white"
        style={{
          opacity: 0.3,
          marginBottom: 128,
          alignSelf: "center",
        }}
      />
      <Text
        style={{
          fontSize: 20,
          color: "white",
          marginBottom: 128,
          textAlign: "center",
          paddingHorizontal: 36,
          lineHeight: 30,
        }}
      >
        Scorecard cares intensely about your privacy. We will never text your
        contacts.
      </Text>
    </View>
  );
}
