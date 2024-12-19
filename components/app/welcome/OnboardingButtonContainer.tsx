import { View, Text } from "react-native";
import React from "react";
import CourseCornerButton from "../course/CourseCornerButton";
import { useNavigation } from "@react-navigation/native";

export default function OnboardingButtonContainer() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        width: "100%",
      }}
    >
      <View
        style={[
          {
            zIndex: 50,
            paddingTop: 64,
            paddingHorizontal: 16,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <CourseCornerButton
          side={"left"}
          icon={"chevron-left"}
          iconPadding={0}
          iconSize={32}
          onPress={() => {
            navigation.goBack();
          }}
        />
        {/* <CourseCornerButton
          side={"right"}
          icon={"info"}
          iconPadding={12}
          iconSize={32}
          onPress={() => navigation.goBack()}
        /> */}
      </View>
    </View>
  );
}
