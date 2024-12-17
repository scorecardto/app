import {View, Text, KeyboardAvoidingView, Alert} from "react-native";
import React, { useEffect, useState } from "react";
import MediumText from "../../text/MediumText";
import useColors from "../../core/theme/useColors";
import { TextInput } from "../../input/TextInput";
import ClubColorChanger from "./ClubColorChanger";
import ClubEmojiChanger from "./ClubEmojiChanger";
import ClubPictureChanger from "./ClubPictureChanger";
import { LongTextInput } from "../../input/LongTextInput";
import { Club } from "scorecard-types";
import { SimpleTextInput } from "../../input/SimpleTextInput";
import Button from "../../input/Button";
import DeleteInput from "../../input/DeleteInput";
import ScorecardModule from "../../../lib/expoModuleBridge";
import {firebase} from "@react-native-firebase/auth";
import {resetPinnedCourses} from "../../core/state/widget/widgetSlice";
import {resetGradeData} from "../../core/state/grades/gradeDataSlice";
import {resetOldCourseStates} from "../../core/state/grades/oldCourseStatesSlice";
import {resetCourseSettings} from "../../core/state/grades/courseSettingsSlice";
import {resetRefreshStatus} from "../../core/state/grades/refreshStatusSlice";
import {resetInvitedNumbers} from "../../core/state/user/invitedNumbersSlice";
import {resetLogin} from "../../core/state/user/loginSlice";
import {resetName} from "../../core/state/user/nameSlice";
import {resetSettings} from "../../core/state/user/settingsSlice";
import {resetUserRank} from "../../core/state/user/userRank";
import {reloadApp} from "../../../lib/reloadApp";
import useScApi from "../../util/hooks/useScApi";
import {useNavigation} from "@react-navigation/native";
import LoadingOverlay from "../../screens/loader/LoadingOverlay";
import useSocial from "../../util/hooks/useSocial";

export default function ClubCustomizeView(props: {
  club: Club;
  startLoading(): void;
  updateClub(c: Club): void;
}) {
  const colors = useColors();
  const api = useScApi();
  const navigation = useNavigation();
  const social = useSocial();

  const [picture, setPicture] = useState(props.club.picture);
  const [name, setName] = useState(props.club.name);
  const [color, setColor] = useState(props.club.heroColor);
  const [bio, setBio] = useState(props.club.bio);
  const [link, setLink] = useState(props.club.link);
  const [emoji, setEmoji] = useState(props.club.emoji);

  useEffect(() => {
    props.updateClub({
      ...props.club,
      picture,
      name,
      heroColor: color,
      bio,
      link,
      emoji,
    });
  }, [picture, name, color, bio, link, emoji]);

  const [loading, setLoading] = useState(false);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <LoadingOverlay show={loading} />
      <ClubPictureChanger
        initialValue={picture}
        onChange={setPicture}
        startLoading={props.startLoading}
      />

      <MediumText style={{ marginBottom: 8, color: colors.primary }}>
        Display Name
      </MediumText>
      <SimpleTextInput
        label="Name"
        setValue={setName}
        value={name}
        disableMarginBottom
      />

      <MediumText style={{ marginBottom: 8, color: colors.primary }}>
        Bio
      </MediumText>
      <LongTextInput
        label="Bio"
        setValue={setBio}
        value={bio || ""}
        allowLineBreak
      />

      <MediumText style={{ marginBottom: 8, color: colors.primary }}>
        Link
      </MediumText>
      <SimpleTextInput
        disableMarginBottom
        label="Add a club link"
        setValue={setLink}
        value={link || ""}
      />

      <ClubColorChanger initialValue={color} onChange={setColor} />
      <ClubEmojiChanger initialValue={emoji} onChange={setEmoji} />

      <MediumText style={{ marginTop: 20, marginBottom: 8, color: colors.primary }}>Danger Zone</MediumText>
      <DeleteInput
          onPress={async () => {
            Alert.alert(
                "Delete Club",
                "This is irreversible. All posts, memberships, and associated content will be erased.",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                    isPreferred: true,
                  },
                  {
                    text: "Erase",
                    style: "destructive",
                    onPress: async () => {
                      Alert.alert("Are You Sure?", "Last chance.", [
                        {
                          text: "Cancel",
                          style: "cancel",
                          isPreferred: true,
                        },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: async() => {
                            setLoading(true);
                            await api.post({
                              pathname: "/v1/clubs/delete",
                              auth: true,
                              body: {
                                internalCode: props.club.internalCode,
                              }
                            });
                            await social.refreshClubs();
                            // @ts-ignore
                            navigation.navigate("Clubs");
                          }
                        }
                      ]);
                    },
                  },
                ]
            );
          }}
      >
        Delete Club Forever
      </DeleteInput>
    </View>
  );
}
