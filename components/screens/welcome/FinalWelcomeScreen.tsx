import { View, Text, SafeAreaView, Animated } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useColors from "../../core/theme/useColors";
import GiantCourseCard from "../../app/welcome/GiantCourseCard";
import GiantCustomizeCard from "../../app/welcome/GiantCustomizeCard";
import { Image } from "expo-image";
import StatusText from "../../text/StatusText";
import Button from "../../input/Button";
import { NavigationProp } from "@react-navigation/native";
import LoadingIndicatorButton from "../../input/LoadingIndicatorButton";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";

const icon = require("../../../assets/icon.svg");
export default function FinalWelcomeScreen(props: { close: () => void }) {
  const colors = useColors();

  const background = "#D9F1FF";

  const numRandomCards = 12;

  const [randomIndex, setRandomIndex] = useState(numRandomCards);

  const doneFetchingGrades = useSelector(
    (state: RootState) => state.gradeData.record !== null
  );

  const closeAnimation = useMemo(() => new Animated.Value(1), []);

  const close = useCallback(() => {
    Animated.timing(closeAnimation, {
      toValue: 0,
      duration: 500,

      useNativeDriver: true,
    }).start(() => {
      props.close();
    });
  }, [closeAnimation]);

  return (
    <Animated.View
      style={{
        height: "100%",
        position: "absolute",
        width: "100%",
        opacity: closeAnimation,
        overflow: "hidden",
        transform: [
          {
            scale: closeAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1],
            }),
          },
        ],
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: background,
        }}
      >
        <View
          style={{
            marginTop: 32,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Image
            source={icon}
            style={{
              width: 100,
              aspectRatio: 1,
            }}
          />
          <Text
            style={{
              fontSize: 28,
              marginTop: 32,
              width: "50%",
              textAlign: "center",
              lineHeight: 48,
            }}
          >
            Welcome to Scorecard
          </Text>
        </View>
        <View style={{ width: "100%", paddingHorizontal: 24, marginTop: 36 }}>
          <GiantCustomizeCard
            increment={() => {
              setRandomIndex((prev) => (prev + 1) % numRandomCards);
            }}
          />
          <GiantCourseCard
            randomIndex={randomIndex}
            colors={["#FFA95A", "#FF5A5A", "#00C34E", "#BE7B66"]}
            names={["Calc BC", "calc bc", "Math", "Calculus"]}
            icons={["function-variant", "shape", "calculator-variant", "nuke"]}
            opacity={0.6}
          />
          <GiantCourseCard
            randomIndex={randomIndex}
            colors={["#AD5AFF", "#FF5AA9", "#00D0ED"]}
            names={["English", "ela", "AP English 3"]}
            icons={["pencil", "skull", "book-open-blank-variant"]}
            opacity={0.4}
          />
        </View>
        <StatusText
          style={{
            fontSize: 20,
            color: "#AAA",
            marginTop: 24,
            lineHeight: 32,
            textAlign: "center",
            width: "70%",
            marginBottom: 32,
          }}
        >
          Tap Customize to rename classes and add colors and icons
        </StatusText>
        {doneFetchingGrades ? (
          <Button
            onPress={() => {
              close();
            }}
          >
            Done
          </Button>
        ) : (
          <LoadingIndicatorButton>
            Loading your Grades...
          </LoadingIndicatorButton>
        )}
      </SafeAreaView>
    </Animated.View>
  );
}
