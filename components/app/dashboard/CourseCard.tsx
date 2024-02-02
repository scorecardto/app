import React, {useContext, useRef, useState} from "react";
import {
  Animated,
  Appearance,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Course, DataContext } from "scorecard-types";
import * as Haptics from "expo-haptics";
import MediumText from "../../text/MediumText";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
import color from "../../../lib/Color";
import LinearGradient from "react-native-linear-gradient";
import colorLib from "color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {Swipeable} from "react-native-gesture-handler";
import {setCourseSetting} from "../../../lib/setCourseSetting";
export default function CourseCard(props: {
  course: Course;
  gradingPeriod: number;
  onClick: () => void;
  onHold: () => void;
  newGrades?: boolean;
}) {
  const { colors, dark } = useTheme();

  const dataContext = useContext(DataContext);

  const accentLabel =
    dataContext.courseSettings[props.course.key]?.accentColor || color.defaultAccentLabel;

  const styles = StyleSheet.create({
    swipeable: {
      backgroundColor: 'transparent',
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 10,
      marginHorizontal: 12,
    },
    wrapper: {
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
    dataContext.courseSettings[props.course.key]?.displayName || props.course.name;

  const courseGlyph = dataContext.courseSettings[props.course.key]?.glyph || undefined;
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

  const progress= useRef(0);
  const release = useRef(0);
  const [threshold, setThreshold] = useState(Number.MAX_VALUE);

    return (
      <View
          onLayout={(event) => {
            setThreshold(event.nativeEvent.layout.width*0.3);
          }}
          style={styles.swipeable}>
        <Swipeable
            rightThreshold={threshold}
            onSwipeableWillOpen={(direction) => {
                if (direction === 'right') release.current = progress.current;
            }}
            renderRightActions={(curProgress, drag) => {
                if (!curProgress.hasListeners()) {
                    let oldValue = 0;
                    curProgress.addListener((value) => {
                        if (release.current) {
                            setCourseSetting(dataContext, props.course.key, {hidden: true});
                        } else if (value > oldValue && value > 0.3) {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }

                        progress.current = oldValue = value.value;
                    });
                }

              const opacity = curProgress.interpolate({
                inputRange: [0, 0.3, ...(release.current ? [release.current, 1] : [])],
                outputRange: [0, 1, ...(release.current ? [1, 0] : [])],
                extrapolate: 'clamp',
              });

              return (
                  <Animated.View style={{
                      flex: 1,
                      backgroundColor: 'rgba(234,234,234,0.4)',
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      opacity,
                  }}>
                      <Animated.View style={{
                        transform: [{translateX: drag}, {translateX: 40}, {
                            scale: curProgress.interpolate({
                                inputRange: [0.3, 0.3035],
                                outputRange: [1, 1.48],
                                extrapolate: 'clamp',
                            })}],
                      }}>
                        <MaterialCommunityIcons
                            name={'eye-off'}
                            size={16}
                            color={colors.text}
                        />
                      </Animated.View>
                  </Animated.View>
              )
        }}>
          <TouchableOpacity onPress={props.onClick} onLongPress={props.onHold}>
            {props.newGrades ? (
              <LinearGradient
                style={styles.wrapper}
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
              >
                {inner}
              </LinearGradient>
            ) : (
              <View style={[styles.wrapper, { backgroundColor: colors.card }]}>
                {inner}
              </View>
            )}
          </TouchableOpacity>
        </Swipeable>
      </View>
  );
}
