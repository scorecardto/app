import { View, Text, Animated, Easing } from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MobileDataContext } from "../../core/context/MobileDataContext";
import { DataContext } from "scorecard-types";
import * as StatusBar from "expo-status-bar";
import { useTheme } from "@react-navigation/native";
import Color from "color";
import { Dimensions } from "react-native";

export default function RefreshIndicator() {
  const data = useContext(DataContext);
  const mobileData = useContext(MobileDataContext);

  const { colors } = useTheme();
  const shown = mobileData.refreshStatus.type !== "IDLE";

  const statusText = useMemo(() => {
    if (mobileData.refreshStatus.courseKey != null) {
      const courseDisplayName =
        data.courseSettings?.[mobileData.refreshStatus.courseKey]
          ?.displayName ||
        data.data?.courses.find(
          (course) => course.key === mobileData.refreshStatus.courseKey
        )?.name;
      return mobileData.refreshStatus.status.replace(
        "COURSE_NAME",
        courseDisplayName || "Unknown Course"
      );
    }
    return mobileData.refreshStatus.status;
  }, [mobileData.refreshStatus]);

  const insets = useSafeAreaInsets();

  const translateYAnimation = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    if (shown) {
      Animated.timing(translateYAnimation, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        StatusBar.setStatusBarStyle("light");
      }, 100);
    } else {
      Animated.timing(translateYAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        StatusBar.setStatusBarStyle("auto");
      }, 100);
    }
  }, [shown]);

  const progressBarTranslateXAnimation = useMemo(
    () => new Animated.Value(0),
    []
  );

  useEffect(() => {
    if (mobileData.refreshStatus.taskRemaining !== 0 && shown) {
      Animated.timing(progressBarTranslateXAnimation, {
        toValue:
          (mobileData.refreshStatus.tasksCompleted + 1) /
          mobileData.refreshStatus.taskRemaining,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start();
    } else {
      progressBarTranslateXAnimation.setValue(0);
    }
  }, [
    mobileData.refreshStatus.tasksCompleted,
    mobileData.refreshStatus.taskRemaining,
  ]);
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: insets.top + 24,
          backgroundColor: colors.button,
          zIndex: 100,
          width: "100%",
        },
        {
          transform: [
            {
              translateY: translateYAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-insets.top - 28, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingVertical: 8,
          width: "100%",
          height: "100%",
        }}
      >
        <Text
          style={{
            color: "#fff",
          }}
        >
          {statusText}
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          height: 3,
          backgroundColor: new Color(colors.button).lighten(0.5).string(),
        }}
      >
        <Animated.View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: colors.button,
            position: "absolute",
            left: 0,
            top: 0,
            transform: [
              {
                translateX: progressBarTranslateXAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-1 * Dimensions.get("window").width, 0],
                }),
              },
            ],
          }}
        ></Animated.View>
      </View>
    </Animated.View>
  );
}
