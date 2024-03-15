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

export default function ArchiveScreen(props: {
  navigation: NavigationProp<any, any>;
}) {
  const { colors } = useTheme();

  const gradeCategoryNames = useSelector(
    (s: RootState) => s.gradeData.record?.gradeCategoryNames
  );

  const courses = useSelector((s: RootState) => s.gradeData.record?.courses);

  const cellCount = Math.ceil((gradeCategoryNames?.length || 0) / 4) * 4;

  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  return (
    <PageThemeProvider
      theme={{
        default: {
          background: "#FFF8FE",
          border: "#FFF2F8",
        },
      }}
    >
      <Background>
        <ScrollView
          ref={scrollViewRef}
          onScroll={(e) => {
            setScrollProgress(e.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
          style={{
            height: "100%",
          }}
        >
          <View
            style={{
              paddingBottom: 72,
              paddingTop: 24,
            }}
          >
            <View
              style={{
                paddingHorizontal: 12,
              }}
            >
              {courses?.map((course, idx) => {
                return (
                  <ArchiveCourseCard
                    course={course}
                    gradeCategoryNames={gradeCategoryNames || []}
                    navigation={props.navigation}
                    key={idx}
                    cellCount={cellCount}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
      </Background>
    </PageThemeProvider>
  );
}
