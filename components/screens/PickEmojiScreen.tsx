import { ScrollView, View } from "react-native";
import { useRef, useState } from "react";
import { NavigationProp, useTheme } from "@react-navigation/native";
import Header from "../text/Header";
import ArchiveCourseCard from "../app/archive/ArchiveCourseCard";
import ArchiveDemoTable from "../app/archive/ArchiveDemoTable";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBanner from "../text/HeaderBanner";
import { useSelector } from "react-redux";
import { RootState } from "../core/state/store";
import PageThemeProvider from "../core/context/PageThemeProvider";
import Background from "../util/Background";
import { Course } from "scorecard-types";
import CourseScreenWrapper from "../app/course/CourseScreenWrapper";
import CourseCornerButtonContainer from "../app/course/CourseCornerButtonContainer";
import LargeText from "../text/LargeText";
import useColors from "../core/theme/useColors";
import EmojiPicker, { emojiFromUtf16 } from "rn-emoji-picker";
import { emojis } from "rn-emoji-picker/dist/data";
// recommend using an asset loader for emojis
// or fetching over network for decreased bundle size
import { StatusBar } from "expo-status-bar";

export default function PickEmojiScreen(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const colors = useColors();

  const { onChange } = props.route.params;

  return (
    <View
      style={{
        height: "100%",
        flexDirection: "column",
        flex: 1,
        backgroundColor: "#FFFFFF",
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
          <EmojiPicker
            emojis={emojis} // emojis data source see data/emojis
            recent={[]} // store of recently used emojis
            autoFocus={true} // autofocus search input
            loading={false} // spinner for if your emoji data or recent store is async
            darkMode={false} // to be or not to be, that is the question
            perLine={7} // # of emoji's per line
            onSelect={(e) => {
              onChange(e);
              props.navigation.goBack();
            }} // callback when user selects emoji - returns emoji obj

            // backgroundColor={'#000'} // optional custom bg color
            // enabledCategories={[ // optional list of enabled category keys
            //   'recent',
            //   'emotion',
            //   'emojis',
            //   'activities',
            //   'flags',
            //   'food',
            //   'places',
            //   'nature'
            // ]}
            // defaultCategory={'food'} // optional default category key
          />
        </View>
      </ScrollView>
    </View>
  );
}
