import { View, Text } from "react-native";
import React from "react";
import ClubSocialPreview from "./ClubSocialPreview";
import ClubQRCodePreview from "./ClubQRCodePreview";
import MediumText from "../../text/MediumText";
import useColors from "../../core/theme/useColors";
import {Club} from "scorecard-types";

export default function ClubHomeView(props: {club: Club}) {
  const colors = useColors();
  return (
    <View>
      <View
        style={{
          shadowOpacity: 0.1,
          shadowColor: "rgba(0,0,0)",
          borderRadius: 16,
          shadowOffset: { height: 0, width: 0 },
          padding: 16,
          backgroundColor: colors.card,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            paddingHorizontal: 8,
          }}
        >
          <MediumText
            style={{
              color: colors.primary,
            }}
          >
            How Clubs Work
          </MediumText>
          <Text
            style={{
              color: colors.text,
              paddingTop: 8,
              paddingBottom: 10,
            }}
          >
            Your members will get notifications when you make a post, even if
            they don't have Scorecard installed.
          </Text>
        </View>
      </View>
      <ClubSocialPreview club={props.club} />
      <ClubQRCodePreview club={props.club} />
    </View>
  );
}
