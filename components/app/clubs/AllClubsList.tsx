import { View, Text } from "react-native";
import React from "react";
import ClubPreview from "./ClubPreview";
import useColors from "../../core/theme/useColors";
import { Club } from "scorecard-types";

export default function AllClubsList(props: { clubs: Club[] }) {
  const colors = useColors();
  return (
    <View
      style={{
        backgroundColor: colors.card,
        marginHorizontal: 12,
        borderRadius: 12,
        marginBottom: 32,
        overflow: "hidden",
      }}
    >
      {props.clubs.map((c, i) => {
        return <ClubPreview club={c} key={i} />;
      })}
    </View>
  );
}
