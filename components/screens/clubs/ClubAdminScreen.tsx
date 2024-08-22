import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import CourseCornerButton from "../../app/course/CourseCornerButton";
import CourseCornerButtonContainer from "../../app/course/CourseCornerButtonContainer";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LargeText from "../../text/LargeText";
import useColors from "../../core/theme/useColors";
import Button from "../../input/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import ManageClubPreview from "../../app/clubs/ManageClubPreview";
import ClubAdminToolbar from "../../app/clubs/ClubAdminToolbar";
import ClubCustomizeView from "./ClubCustomizeView";

export default function ClubAdminScreen(props: {
  navigation: NavigationProp<any, any>;
}) {
  const colors = useColors();
  const navigation = useNavigation();

  const [tab, setTab] = useState("home");

  return (
    <View
      style={{
        height: "100%",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <View
        style={{
          flexShrink: 0,
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            // backgroundColor: "red",
            paddingTop: 24,
          }}
        >
          <CourseCornerButtonContainer
            onPressLeft={() => {
              props.navigation.goBack();
            }}
            hideRight
            onPressRight={() => {}}
          />

          <View
            style={{
              paddingHorizontal: 8,
              paddingTop: 4,
            }}
          >
            <LargeText
              style={{
                color: colors.primary,
              }}
              textProps={{
                numberOfLines: 1,
              }}
            >
              Control Panel
            </LargeText>
          </View>
          <ClubAdminToolbar tab={tab} setTab={setTab} />
        </View>
      </View>
      <ScrollView
        style={{
          flexGrow: 1,
          padding: 16,
          flex: 1,
        }}
      >
        <View
          style={{
            height: "100%",
            flex: 1,
          }}
        >
          {tab === "edit" && <ClubCustomizeView />}
        </View>
      </ScrollView>
    </View>
  );
}
