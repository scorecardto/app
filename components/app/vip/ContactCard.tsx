import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import MediumText from "../../text/MediumText";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
import Ionicon from "@expo/vector-icons/Ionicons";
export default function ContactCard(props: {
  name: string;
  phoneNumber: string;
  showPhoneNumber: boolean;
  onPress: () => void;
  index: number;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity>
      <View
        style={{
          borderTopWidth: props.index !== 0 ? 1 : 0,
          borderTopColor: colors.borderNeutral,
          paddingHorizontal: 16,
          paddingVertical: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              color: colors.primary,
              fontSize: 16,
              fontWeight: "500",
              marginRight: 8,
            }}
          >
            {props.name}
          </Text>
          {props.showPhoneNumber && (
            <Text
              style={{
                color: colors.text,
                fontSize: 14,
              }}
            >
              {props.phoneNumber}
            </Text>
          )}
        </View>
        <View
          style={{
            backgroundColor: "#1DC027",
            borderRadius: 30,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            paddingHorizontal: 12,
          }}
        >
          <Ionicon name="chatbubble" size={16} color="#fff" />
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              marginLeft: 8,
            }}
          >
            Invite
          </Text>
        </View>
      </View>
    </TouchableOpacity>

    // <View
    //   style={{
    //     paddingVertical: 10,
    //     paddingHorizontal: 16,
    //     backgroundColor: colors.card,
    //     marginBottom: 4,
    //   }}
    // >
    //   <MediumText
    //     style={{
    //       fontSize: 16,
    //       color: colors.primary,
    //     }}
    //   >
    //     {props.name}
    //   </MediumText>
    //   <SmallText
    //     style={{
    //       fontSize: 12,
    //       color: colors.text,
    //     }}
    //   >
    //     {props.phoneNumber}
    //   </SmallText>
    // </View>
  );
}
