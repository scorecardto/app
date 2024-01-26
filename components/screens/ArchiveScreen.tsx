import {ScrollView, View} from "react-native";
import React, {useContext, useRef, useState} from "react";
import {useTheme} from "@react-navigation/native";
import Header from "../text/Header";
import {DataContext} from "scorecard-types";
import ArchiveCourseCard from "../app/archive/ArchiveCourseCard";
import ArchiveDemoTable from "../app/archive/ArchiveDemoTable";
import {SafeAreaView} from "react-native-safe-area-context";
import HeaderBanner from "../text/HeaderBanner";

export default function ArchiveScreen() {
  const { colors } = useTheme();

  const data = useContext(DataContext);

  const cellCount =
    Math.ceil((data.data?.gradeCategoryNames.length || 0) / 4) * 4;

  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  return (
    <SafeAreaView>
      <ScrollView
        ref={scrollViewRef}
        onScroll={(e) => {
          setScrollProgress(e.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
        style={{
          height: "100%",
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            paddingBottom: 72,
          }}
        >
          <View
            style={{
              zIndex: 1,
            }}
          >
            <Header header="Archive">
              <ArchiveDemoTable
                gradeCategoryNames={data.data?.gradeCategoryNames || []}
              />
            </Header>
          </View>

          <View
            style={{
              paddingHorizontal: 12,
            }}
          >
            {data.data?.courses.map((course, idx) => {
              return (
                <ArchiveCourseCard
                  course={course}
                  key={idx}
                  cellCount={cellCount}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
      <HeaderBanner
        label="Archive"
        show={scrollProgress > 80}
        onPress={() => {
          scrollViewRef.current?.scrollTo({
            y: 0,
            animated: true,
          });
        }}
      />
    </SafeAreaView>
  );
}
