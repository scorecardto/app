import { View, Text, ScrollView } from "react-native";
import React from "react";
import CourseCornerButton from "../../app/course/CourseCornerButton";
import CourseCornerButtonContainer from "../../app/course/CourseCornerButtonContainer";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LargeText from "../../text/LargeText";
import useColors from "../../core/theme/useColors";
import Button from "../../input/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import ManageClubPreview from "../../app/clubs/ManageClubPreview";

export default function ManageClubsScreen(props: {
  navigation: NavigationProp<any, any>;
}) {
  const colors = useColors();
  const navigation = useNavigation();

  const clubs = useSelector((r: RootState) => {
    return r.social.clubs;
  });

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
              My Clubs
            </LargeText>
          </View>
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
          <View
            style={{
              marginBottom: 24,
            }}
          >
            {clubs
              .filter((c) => c.canManage)
              .map((c, i) => {
                return <ManageClubPreview club={c} key={i} />;
              })}
          </View>
          <Button
            onPress={() => {
              // @ts-ignore
              navigation.navigate("createClub");
            }}
          >
            Create Club
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
