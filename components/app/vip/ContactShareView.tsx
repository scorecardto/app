import { View, Text, Share } from "react-native";
import React, { useCallback } from "react";
import InviteFlowHeader from "./InviteFlowHeader";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import ActionButton from "../../input/ActionButton";
import useColors from "../../core/theme/useColors";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import Toast from "react-native-toast-message";

export default function ContactShareView(props: {
  close: () => void;
  numInvited: number;
  invite: () => void;
}) {
  const firstName = useSelector(
    (state: RootState) => {
      const name = state.name.firstName.split(" ").join("");

      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    },
    () => true
  );

  const share = useCallback(async () => {
    const shareResult = await Share.share({
      message: "https://scorecardgrades.com/i/" + firstName,
    });

    // @ts-ignore
    const activityType: string = shareResult.activityType || "";

    if (activityType.toLowerCase().includes("message")) {
      props.invite();
    } else if (shareResult.action !== "dismissedAction") {
      Toast.show({
        type: "info",
        text1: "Use iMessage",
        text2:
          "To recieve an invite point, you must use iMessage to share the link.",
      });
    }
  }, []);

  const colors = useColors();
  return (
    <View
      style={{
        height: "100%",
        justifyContent: "center",
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
          header="Send 2 Invites"
          subheader="make sure to use iMessage"
        />
      </View>

      <View
        style={{
          alignItems: "center",
        }}
      >
        <View>
          <MaterialIcon
            name={props.numInvited === 0 ? "account-circle" : "check"}
            size={192}
            color={colors.text}
            style={{ opacity: 0.3, alignSelf: "center" }}
          />
          <Text
            style={{
              fontSize: 20,

              color: colors.text,
              textAlign: "center",
              paddingHorizontal: 72,
              lineHeight: 32,
              marginTop: 32,
            }}
          >
            {props.numInvited === 0
              ? "When you're ready, text a link to your first contact using iMessage."
              : "Thanks! Now, text a link to your second contact."}
          </Text>
        </View>
      </View>
      <View
        style={{
          alignSelf: "center",
          marginTop: 32,
          position: "absolute",
          bottom: 64,
        }}
      >
        {props.numInvited === 0 && (
          <ActionButton type="BLACK" onPress={() => share()}>
            Share with Person 1
          </ActionButton>
        )}
        <View style={{ height: 16 }} />
        <ActionButton
          type={props.numInvited === 0 ? "DISABLED" : "BLACK"}
          onPress={() => share()}
        >
          Share with Person 2
        </ActionButton>
      </View>
    </View>
  );
}
