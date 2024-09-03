import { View, Text } from "react-native";
import React from "react";
import { ClubPost } from "scorecard-types";
import ClubPostPreview from "./ClubPostPreview";

export default function ClubRecentPostsList(props: {
  recentPosts: ClubPost[];
}) {
  return (
    <View
      style={{
        marginHorizontal: 12,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {props.recentPosts.map((p, i) => (
        <>
          <View
            style={{
              marginTop: i === 0 ? 0 : 6,
            }}
          >
            <ClubPostPreview post={p} key={i} />
          </View>
        </>
      ))}
    </View>
  );
}
