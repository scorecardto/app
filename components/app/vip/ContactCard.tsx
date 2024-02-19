import { View, Text, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import MediumText from "../../text/MediumText";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
import Ionicon from "@expo/vector-icons/Ionicons";
import Contacts from "expo-contacts";
import { Image } from "expo-image";
function ContactCard(props: {
  name: string;
  phoneNumber: string;
  showPhoneNumber: boolean;
  onPress: () => void;
  image?: Contacts.Image;
  selected?: boolean;
  alreadyOnApp?: boolean;
  alreadyInvited?: boolean;
}) {
  const SHOW_PHOTOS = false;

  const initials = useMemo(() => {
    const words = props.name.split(" ");
    return words
      .map((word) => {
        if (word.charCodeAt(0) < 128) {
          return word.charAt(0);
        } else return "";
      })
      .slice(0, 2)
      .join("");
  }, [props.name]);
  return (
    <TouchableOpacity
      disabled={props.alreadyOnApp || props.alreadyInvited}
      onPress={() => {
        props.onPress();
      }}
    >
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.borderNeutral,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {props.image?.uri && SHOW_PHOTOS ? (
            <Image
              source={props.image?.uri}
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
          ) : (
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.borderNeutral,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                {initials}
              </Text>
            </View>
          )}
          <View
            style={{
              marginLeft: 16,
            }}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: 16,
                fontWeight: "500",
                marginRight: 8,
                marginVertical: 4,
              }}
            >
              {props.name}
            </Text>
            {props.showPhoneNumber && (
              <Text
                style={{
                  color: colors.text,
                  fontSize: 14,
                  marginVertical: 4,
                }}
              >
                {props.alreadyOnApp
                  ? "Already on Scorecard"
                  : props.alreadyInvited
                  ? "Already invited!"
                  : props.phoneNumber}
              </Text>
            )}
          </View>
        </View>
        {props.alreadyOnApp ? (
          <Text
            style={{
              color: colors.text,
              fontSize: 32,
              marginVertical: 4,
              marginRight: 8,
              textTransform: "uppercase",
            }}
          >
            😎
          </Text>
        ) : props.alreadyInvited ? (
          <Text
            style={{
              color: colors.text,
              fontSize: 32,
              marginVertical: 4,
              marginRight: 8,
              textTransform: "uppercase",
            }}
          >
            🥳
          </Text>
        ) : (
          <View
            style={{
              borderWidth: 1,
              borderColor: props.selected
                ? "transparent"
                : colors.borderNeutral,
              backgroundColor: props.selected ? "#1AB762" : "transparent",
              borderRadius: 18,
              height: 32,
              width: 32,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              marginRight: 8,
            }}
          >
            {props.selected && (
              <View
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: "white",
                  borderRadius: 3,
                }}
              />
            )}
          </View>
        )}
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

export default React.memo(ContactCard, (prev, next) => {
  return (
    prev.selected === next.selected &&
    prev.alreadyOnApp === next.alreadyOnApp &&
    prev.alreadyInvited === next.alreadyInvited
  );
});
