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
      {props.clubs
        .slice()
        .sort((club1, club2) => {
          if (club1.isOwner !== club2.isOwner) {
            return club1.isOwner ? -1 : 1;
          }
          if (club1.canManage !== club2.canManage) {
            return club1.canManage ? -1 : 1;
          }
          if (club1.isMember !== club2.isMember) {
            return club1.isMember ? -1 : 1;
          }
          return club2.memberCount - club1.memberCount;
        })
        .map((c, i) => {
          return <ClubPreview club={c} key={i} />;
        })}
    </View>
  );
}
