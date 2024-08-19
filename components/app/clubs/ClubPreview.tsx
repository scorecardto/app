import { View, Text } from "react-native";
import React from "react";
import Club from "../../../lib/types/Club";
import useColors from "../../core/theme/useColors";
import LargeText from "../../text/LargeText";
import MediumText from "../../text/MediumText";

export default function ClubPreview(props: { club: Club }) {
  const colors = useColors();
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
        ></View>
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
          flexGrow: 1,
        }}
      >
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
      </View>
    </View>
  );
}
