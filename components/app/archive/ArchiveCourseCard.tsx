import { View, Text, TouchableOpacity } from "react-native";
import { Course } from "scorecard-types";
import MediumText from "../../text/MediumText";
import { NavigationProp } from "@react-navigation/native";
import ArchiveCourseChip from "./ArchiveCourseChip";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import { setCourseSetting } from "../../core/state/grades/courseSettingsSlice";
import useColors from "../../core/theme/useColors";
import { setGradeCategory } from "../../core/state/grades/gradeCategorySlice";
export default function ArchiveCourseCard(props: {
  course: Course;
  cellCount: number;
  navigation: NavigationProp<any, any>;
  gradeCategoryNames: string[];
}) {
  const courseSettings = useSelector((s: RootState) => s.courseSettings);

  const colors = useColors();
  const dispatch = useDispatch();

  const hidden = courseSettings[props.course.key]?.hidden;
  const opacity = hidden ? 0.3 : 1;
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: colors.card,
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 20,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          marginVertical: 12,
          marginHorizontal: 24,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <MediumText
          style={{
            fontSize: 16,
            color: colors.primary,
            opacity,
          }}
        >
          {courseSettings[props.course.key]?.displayName || props.course.name}
        </MediumText>
        {hidden && (
          <TouchableOpacity
            style={{
              borderRadius: 10,
              paddingVertical: 5,
              paddingHorizontal: 10,
              marginTop: -4,
              backgroundColor: colors.backgroundNeutral,
              borderColor: colors.borderNeutral,
              borderWidth: 1.75,
            }}
            onPress={() => {
              dispatch(
                setCourseSetting({
                  key: props.course.key,
                  value: {
                    hidden: false,
                  },
                  save: "STATE_AND_STORAGE",
                })
              );
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 10,
              }}
            >
              Unhide
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {new Array(props.cellCount / 4).fill(0).map((_, row) => {
        return (
          <View
            key={row}
            style={{
              width: "100%",
              backgroundColor: colors.border,
              display: "flex",
              flexDirection: "row",
              borderTopColor: colors.border,
              borderTopWidth: 2,
              opacity,
            }}
          >
            {new Array(4).fill(0).map((_, col) => {
              const idx = row * 4 + col;

              return (
                <View
                  key={idx}
                  style={{
                    width: "25%",
                    paddingRight: idx % 4 !== 3 ? 2 : 0,
                  }}
                >
                  <View
                    style={{
                      padding: 8,
                      width: "100%",
                      backgroundColor: colors.card,
                      height: 62,
                    }}
                  >
                  {props.course.grades[idx] && <>
                          <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate("course", {
                          key: props.course.key,
                          gradeCategory: idx,
                        });
                      }}
                    >
                      <ArchiveCourseChip
                        accentColorLabel={
                          courseSettings[props.course.key]?.accentColor ||
                          "blue"
                        }
                        active={props.course.grades[idx]!.active}
                        grade={props.course.grades[idx]!.value}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 8,
                        marginVertical: 4,
                      }}
                    >
                      {props.gradeCategoryNames[idx]}
                    </Text>
                  </>}
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}
