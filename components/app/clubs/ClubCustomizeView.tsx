import { View, Text, KeyboardAvoidingView } from "react-native";
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

export default function ClubCustomizeView(props: {
  club: Club;
  startLoading(): void;
  updateClub(c: Club): void;
}) {
  const colors = useColors();

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
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
    >
      <ClubPictureChanger initialValue={picture} onChange={setPicture} startLoading={props.startLoading} />

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
    </KeyboardAvoidingView>
  );
}
