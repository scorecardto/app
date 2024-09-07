import { View, Text } from "react-native";
import React from "react";
import useColors from "../../core/theme/useColors";
import MediumText from "../../text/MediumText";
import ScorecardQRCode from "../../util/ScorecardQRCode";
import { Club } from "scorecard-types";
export default function ClubQRCodePreview(props: { club: Club }) {
  const colors = useColors();

  return (
    <View
      style={{
        shadowOpacity: 0.1,
        shadowColor: "rgba(0,0,0)",
        borderRadius: 16,
        shadowOffset: { height: 0, width: 0 },
        padding: 16,
        backgroundColor: colors.card,
        marginTop: 16,
        marginBottom: 48,
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
          QR Codes
        </MediumText>
        <Text
          style={{
            color: colors.text,
            paddingTop: 8,
            paddingBottom: 10,
          }}
        >
          You can print and download this code, and people don't need Scorecard
          to scan it.
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          position: "relative",
          paddingVertical: 8,
        }}
      >
        <ScorecardQRCode
          link={`https://scorecardgrades.com/joinclub/${props.club.clubCode}`}
          size={256}
        />
      </View>
    </View>
  );
}
