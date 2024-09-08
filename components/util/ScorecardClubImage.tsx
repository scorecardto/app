import { Image, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import { Club, ClubBase } from "scorecard-types";
import ScorecardImage from "./ScorecardImage";

export default function ScorecardClubImage(props: {
  club: ClubBase;
  width: number;
  noAsync?: boolean;
  height: number;
}) {
  return (
    <>
      {props.club.picture ? (
        <ScorecardImage
          noAsync={props.noAsync}
          width={props.width}
          height={props.height}
          id={props.club.picture}
        ></ScorecardImage>
      ) : (
        <View
          style={{
            height: props.height,
            width: props.width,
            backgroundColor: props.club.heroColor || "#4A93FF",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: props.height / 1.8,
            }}
          >
            {props.club.emoji || "🙂"}
          </Text>
        </View>
      )}
    </>
  );
}
