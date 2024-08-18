import ReactNative, { View, Text, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import CourseCornerButton from "../../app/course/CourseCornerButton";
import CourseCornerButtonContainer from "../../app/course/CourseCornerButtonContainer";
import { NavigationProp } from "@react-navigation/native";
import LargeText from "../../text/LargeText";
import useColors from "../../core/theme/useColors";
import { TextInput } from "../../input/TextInput";
import StatusText from "../../text/StatusText";
import Button from "../../input/Button";
import MediumText from "../../text/MediumText";

export default function CreateClubScreen(props: {
  navigation: NavigationProp<any, any>;
}) {
  const colors = useColors();

  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");

  const usernameRef = useRef<ReactNative.TextInput>(null);
  const passwordRef = useRef<ReactNative.TextInput>(null);

  const [tickerValid, setTickerValid] = useState(false);

  useEffect(() => {
    setTickerValid(false);
  }, [ticker]);
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
              Create Club
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
          <MediumText style={{ marginBottom: 16, color: colors.primary }}>
            Name
          </MediumText>
          <TextInput
            label="Name"
            setValue={setName}
            value={name}
            type="text"
            ref={usernameRef}
          />
          <MediumText style={{ marginTop: 16, color: colors.primary }}>
            Club Code
          </MediumText>
          <StatusText
            style={{
              color: colors.text,
              fontSize: 14,
              marginTop: 8,
              marginBottom: 16,
            }}
          >
            For example, "DOGS" or "MODELUN"
          </StatusText>
          <TextInput
            label="Club Code"
            setValue={setTicker}
            value={ticker}
            type="username"
            ref={passwordRef}
          />

          <Button onPress={() => {}}>Login</Button>
        </View>
      </ScrollView>
    </View>
  );
}
