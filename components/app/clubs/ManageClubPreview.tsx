import { View, Text, TouchableOpacity } from "react-native";
import useColors from "../../core/theme/useColors";
import MediumText from "../../text/MediumText";
import { Club } from "scorecard-types";

import { useNavigation } from "@react-navigation/native";
import ScorecardImage from "../../util/ScorecardImage";

export default function ManageClubPreview(props: { club: Club }) {
  const colors = useColors();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        // @ts-ignore
        navigation.navigate("clubAdmin", {
          internalCode: props.club.internalCode,
        });
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 12,
          borderTopColor: colors.borderNeutral,
          borderTopWidth: 2,
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
              overflow: "hidden",
            }}
          >
            <ScorecardImage id={props.club.picture!} height={44} width={44} />
          </View>
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
              {props.club.clubCode} - {props.club.memberCount} member
              {props.club.memberCount === 1 ? "" : "s"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
