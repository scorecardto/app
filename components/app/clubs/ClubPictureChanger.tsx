import { View, Text } from "react-native";
import React from "react";
import MediumText from "../../text/MediumText";
import useColors from "../../core/theme/useColors";
import Button from "../../input/Button";

export default function ClubPictureChanger() {
  const colors = useColors();
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 16,
      }}
    >
      <View
        style={{
          height: 112,
          width: 112,
          borderRadius: 16,
          backgroundColor: colors.textInput,
          padding: 16,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: colors.text,
            textAlign: "center",
            fontStyle: "italic",
            fontSize: 12,
          }}
        >
          Tap to add a profile picture
        </Text>
      </View>
      <View
        style={{
          marginLeft: 16,
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <MediumText style={{ marginBottom: 8, color: colors.primary }}>
          Profile Picture
        </MediumText>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Button onPress={() => {}} small>
            Change
          </Button>
        </View>
      </View>
    </View>
  );
}
