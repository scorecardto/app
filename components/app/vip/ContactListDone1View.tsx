import { View, Text } from "react-native";
import React from "react";
import InviteFlowHeader from "./InviteFlowHeader";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import ActionButton from "../../input/ActionButton";

export default function ContactListDone1View(props: { close: () => void }) {
  return (
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        backgroundColor: "#1AB762",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: "100%",
          top: 0,
        }}
      >
        <InviteFlowHeader
          header="Select Person 1"
          subheader="then, send them a link"
        />
      </View>

      <View
        style={{
          alignItems: "center",
        }}
      >
        <View>
          <MaterialIcon
            name="check"
            size={192}
            color="white"
            style={{ opacity: 0.3, alignSelf: "center" }}
          />
          <Text
            style={{
              fontSize: 24,
              color: "white",
              textAlign: "center",
              paddingHorizontal: 36,
              lineHeight: 30,
              marginTop: 32,
            }}
          >
            Thanks! One invite left.
          </Text>
          <View
            style={{
              alignSelf: "center",
              marginTop: 32,
            }}
          >
            <ActionButton type="WHITE" onPress={() => props.close()}>
              Invite Person 2
            </ActionButton>
          </View>
        </View>
      </View>
    </View>
  );
}
