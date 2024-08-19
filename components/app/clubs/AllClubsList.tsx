import { View, Text } from "react-native";
import React from "react";
import Club from "../../../lib/types/Club";
import ClubPreview from "./ClubPreview";
import useColors from "../../core/theme/useColors";

export default function AllClubsList() {
  const clubs: Club[] = [
    {
      name: "Public Speaking Club - On Scorecard",
      code: "SPEAKING",
      heroColor: "red",
      isMember: true,
      isOwner: true,
      memberCount: 150,
      posts: [
        {
          clubCode: "SPEAKING",
          clubName: "Public Speaking Club",
          description:
            "We’re hosting a POLITICAL DEBATE with John Doe and Jane Herbert. Come to Room 704 Tomorrow!",
          heroColor: "red",
          postDate: 0,
        },
      ],
    },
    {
      name: "Senior Assassins",
      code: "ASSASSINS",
      isMember: true,
      isOwner: true,
      heroColor: "red",
      memberCount: 500,
      posts: [],
    },
  ];

  const colors = useColors();
  return (
    <View
      style={{
        backgroundColor: colors.card,
        margin: 12,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {clubs.map((c) => {
        return <ClubPreview club={c} />;
      })}
    </View>
  );
}
