import { View } from "moti";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useColors from "../../core/theme/useColors";
import useAccents from "../../core/theme/useAccents";
import SmallText from "../../text/SmallText";
import { Text } from "react-native";
export default function CommentsPreview() {
  const colors = useColors();
  const accents = useAccents();
  return (
    <View
      style={{
        borderRadius: 8,
        marginTop: 24,
        overflow: "hidden",
        backgroundColor: colors.card,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="message"
          color={accents.primary}
          size={20}
          style={{
            paddingTop: 2,
          }}
        />
        <SmallText
          style={{ fontSize: 16, paddingLeft: 8, color: colors.primary }}
        >
          Comments
        </SmallText>
      </View>
      <Text style={{ fontSize: 14, color: colors.text }}>Open</Text>
    </View>
  );
}
