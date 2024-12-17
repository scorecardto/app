import { View, Text, Animated, Easing } from "react-native";
import { useEffect, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as StatusBar from "expo-status-bar";
import Color from "color";
import { Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import useColors from "../../core/theme/useColors";

export default function RefreshIndicator() {
  const refreshStatus = useSelector((state: RootState) => state.refreshStatus);

  const courseDisplayName = useSelector((state: RootState) => {
    if (refreshStatus.courseKey != null) {
      return (
        state.courseSettings?.[refreshStatus.courseKey]?.displayName ||
        state.gradeData.record?.courses.find(
          (course) => course.key === refreshStatus.courseKey
        )?.name
      );
    } else {
      return null;
    }
  });
  const colors = useColors();
  const shown = refreshStatus.type !== "IDLE";

  const statusText = useMemo(() => {
    if (courseDisplayName) {
      return refreshStatus.status.replace(
        "COURSE_NAME",
        courseDisplayName || "Unknown Course"
      );
    }
    return refreshStatus.status;
  }, [refreshStatus]);

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
    if (refreshStatus.taskRemaining !== 0 && shown) {
      Animated.timing(progressBarTranslateXAnimation, {
        toValue:
          (refreshStatus.tasksCompleted + 1) / refreshStatus.taskRemaining,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start();
    } else {
      progressBarTranslateXAnimation.setValue(0);
    }
  }, [refreshStatus.tasksCompleted, refreshStatus.taskRemaining]);

  return (
    <>
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: insets.bottom + 35,
            backgroundColor: colors.button,
            zIndex: 100,
            width: "100%",
          },
          {
            transform: [
              {
                translateY: translateYAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [insets.top + 28, 0],
                }),
              },
            ],
          },
        ]}
      >
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
              bottom: 0,
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
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
      </Animated.View>
    </>
  );
}
