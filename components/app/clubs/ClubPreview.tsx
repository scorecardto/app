import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useCallback, useState } from "react";
import useColors from "../../core/theme/useColors";
import LargeText from "../../text/LargeText";
import MediumText from "../../text/MediumText";
import { Club } from "scorecard-types";

import useSocial from "../../util/hooks/useSocial";
import Toast from "react-native-toast-message";
import useScApi from "../../util/hooks/useScApi";
import ScorecardImage from "../../util/ScorecardImage";

export default function ClubPreview(props: { club: Club }) {
  const colors = useColors();

  const social = useSocial();

  const [loading, setLoading] = useState(false);

  const api = useScApi();
  const join = useCallback(async () => {
    if (props.club.isMember) return;

    setLoading(true);
    api
      .post({
        pathname: "/v1/clubs/join",
        auth: true,
        body: {
          ticker: props.club.code,
        },
      })
      .then(() => {
        Toast.show({
          type: "info",
          text1: `Welcome to ${props.club.name}!`,
          text2: `You are now a member of this club.`,
        });
      })
      .catch(() => {
        Toast.show({
          type: "info",
          text1: `Error Occured`,
          text2: `Something went wrong trying to join this club.`,
        });
      })
      .finally(() => {
        social.refreshClubs().then(() => {
          setLoading(false);
        });
      });
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomColor: colors.background,
        borderBottomWidth: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flexShrink: 1,
          flexGrow: 0,
        }}
      >
        <View
          style={{
            height: 44,
            width: 44,
            borderRadius: 48,
            backgroundColor: "gray",
          }}
        >
            <ScorecardImage id={props.club.picture!} height={44} width={44} />
        </View>
        <View
          style={{
            paddingLeft: 12,
            paddingRight: 56,
          }}
        >
          <MediumText
            style={{
              fontSize: 14,
              color: colors.primary,
              marginBottom: 4,
              overflow: "hidden",
              flex: 1,
            }}
            numberOfLines={1}
          >
            {props.club.name}
          </MediumText>
          <Text
            style={{
              fontSize: 12,
              color: colors.text,
            }}
          >
            {props.club.code} - {props.club.memberCount} member
            {props.club.memberCount === 1 ? "" : "s"}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexShrink: 0,
          flexGrow: 0,
        }}
      >
        {!props.club.isMember && (
          <View>
            {loading ? (
              <View
                style={{
                  marginRight: 8,
                }}
              >
                <ActivityIndicator />
              </View>
            ) : (
              <TouchableOpacity onPress={join}>
                <View
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 2,
                    borderRadius: 12,
                    backgroundColor: "red",
                    alignSelf: "flex-end",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    JOIN
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
