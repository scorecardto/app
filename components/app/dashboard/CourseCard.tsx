import React, { useContext, useState } from "react";
import {
  Animated,
  Appearance,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Course, DataContext } from "scorecard-types";
import MediumText from "../../text/MediumText";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
import color from "../../../lib/Color";
import LinearGradient from "react-native-linear-gradient";
import colorLib from "color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
export default function CourseCard(props: {
  course: Course;
  gradingPeriod: number;
  onClick: () => void;
  onHold: () => void;
  newGrades?: boolean;
}) {
  const { colors, dark } = useTheme();

  const { courseSettings } = useContext(DataContext);

  const accentLabel =
    courseSettings[props.course.key]?.accentColor || color.defaultAccentLabel;

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: "transparent",
      borderRadius: 12,
      overflow: "hidden",
      marginHorizontal: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      textAlignVertical: "center",
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      overflow: "hidden",
    },
    badge: {
      width: 56,
      height: 56,
      backgroundColor:
        color.AccentsMatrix[accentLabel][dark ? "dark" : "default"].primary,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      paddingLeft: 24,
      color: colors.primary,
      flex: 1,
    },
    grade: {
      marginRight: 24,
      marginLeft: 6,
      fontSize: 16,
      color: colors.text,
    },
  });

  const courseDisplayName =
    courseSettings[props.course.key]?.displayName || props.course.name;

  const courseGlyph = courseSettings[props.course.key]?.glyph || undefined;

  const swipeRef = React.useRef<Swipeable>(null);

  const inner = (
    <>
      <View style={styles.left}>
        <View style={styles.badge}>
          {courseGlyph ? (
            <MaterialCommunityIcons
              // @ts-ignore

              name={courseGlyph}
              size={24}
              color={"#FFFFFF"}
            />
          ) : (
            <></>
          )}
        </View>
        <MediumText
          numberOfLines={1}
          ellipsizeMode={"tail"}
          style={styles.header}
        >
          {courseDisplayName}
        </MediumText>
      </View>
      <SmallText style={styles.grade}>
        {props.newGrades
          ? "New Grades"
          : props.course.grades[props.gradingPeriod]?.value ?? "NG"}
      </SmallText>
    </>
  );

  const [show, setShow] = useState(true);
  const [playedVibration, setPlayedVibration] = useState(false);
  return (
    <TouchableOpacity
      onPress={props.onClick}
      onLongPress={props.onHold}
      style={{
        marginBottom: 10,
      }}
    >
      <Swipeable
        ref={swipeRef}
        onEnded={(o) => {
          // @ts-ignore
          if (o.nativeEvent.x > 200) {
            props.onClick();
            setShow(false);

            setTimeout(() => {
              setShow(true);
            }, 600);
          }

          setTimeout(() => {
            swipeRef.current?.close();
          }, 100);
        }}
        renderLeftActions={(progress, dragX) => {
          const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-60, -30, 0, 0],
          });

          const opacity = dragX.interpolate({
            inputRange: [0, 20, 100, 101],
            outputRange: [0, 0, 1, 1],
          });

          const scale = dragX.interpolate({
            inputRange: [0, 95, 100],
            outputRange: [0.5, 0.7, 1],
            extrapolate: "clamp",
          });

          const vibrate = dragX.interpolate({
            inputRange: [0, 99, 100, 101],
            outputRange: [0, 0, 1, 0],
          });

          dragX.addListener(({ value }) => {
            if (Math.floor(value) > 100) {
              setPlayedVibration((prev) => {
                if (!prev) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
                return true;
              });
            } else {
              setPlayedVibration(false);
            }
          });
          return (
            <Animated.View
              style={[
                {
                  width: 80,
                  height: "100%",
                  paddingLeft: 18,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                },
                {
                  transform: [{ translateX: trans }, { scale: scale }],
                  opacity: opacity,
                },
              ]}
            >
              <Text
                style={{
                  color: colors.text,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Open
              </Text>
            </Animated.View>
          );
        }}
        overshootLeft={true}
      >
        {props.newGrades ? (
          <LinearGradient
            colors={[
              colors.card,
              colorLib(
                color.AccentsMatrix[accentLabel][dark ? "dark" : "default"]
                  .gradientCenter
              )
                .mix(colorLib(colors.card), 0.5)
                .hex(),
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.wrapper,
              {
                opacity: show ? 1 : 0,
              },
            ]}
          >
            {inner}
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.wrapper,
              { backgroundColor: colors.card, opacity: show ? 1 : 0 },
            ]}
          >
            {inner}
          </View>
        )}
      </Swipeable>
    </TouchableOpacity>
  );
}
