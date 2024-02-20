import { View, Text } from "react-native";
import React, { useEffect } from "react";
import LargeText from "../../text/LargeText";
import StatusText from "../../text/StatusText";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InviteFlowHeader(props: {
  header: string;
  subheader: string;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        justifyContent: "center",
        width: "100%",
        backgroundColor: "#1AB762",
        alignItems: "center",
      }}
    >
      <LargeText
        style={{
          fontSize: 28,
          color: "white",
          marginTop: 4,
          marginBottom: 12,
        }}
      >
        {props.header}
      </LargeText>
      <StatusText
        style={{
          color: "white",
          marginBottom: 20,
        }}
      >
        {props.subheader}
      </StatusText>
    </View>
  );
}
