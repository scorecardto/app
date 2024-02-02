import {View, Text, TouchableOpacity} from "react-native";
import React, { useContext } from "react";
import { Course, DataContext } from "scorecard-types";
import MediumText from "../../text/MediumText";
import {NavigationProp, useTheme} from "@react-navigation/native";
import ArchiveCourseChip from "./ArchiveCourseChip";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";
import {setCourseSetting} from "../../../lib/setCourseSetting";
export default function ArchiveCourseCard(props: {
  course: Course;
  cellCount: number;
  navigation: NavigationProp<any, any>;
}) {
  const data = useContext(DataContext);
  const { colors } = useTheme();

  const hidden = data.courseSettings[props.course.key]?.hidden;
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
          flexDirection :'row', 
          justifyContent: "space-between",
        }}
      >
        <MediumText
          style={{
            fontSize: 16,
            color: colors.primary,
              opacity
          }}
        >
          {data.courseSettings[props.course.key]?.displayName ||
            props.course.name}
        </MediumText>
          {hidden &&
              <TouchableOpacity
                  style={{
                      borderRadius: 10,
                      padding: 10,
                      backgroundColor: colors.backgroundNeutral,
                      borderColor: colors.borderNeutral,
                      borderWidth: 1.75,
                  }}
                  onPress={() => {
                      setCourseSetting(data, props.course.key, {hidden: false});
                  }}
              >
                  <MaterialCommunityIcon
                      name={'eye'}
                      size={16}
                      color={colors.text}
                  />
              </TouchableOpacity>
          }
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
                      height: 52,
                    }}
                  >
                    {props.course.grades[idx]?.value != null && (
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.navigate("course", {key: props.course.key});
                            }}
                        >
                          <ArchiveCourseChip
                            accentColorLabel={
                              data.courseSettings[props.course.key]?.accentColor ||
                              "blue"
                            }
                            active={props.course.grades[idx]?.active || false}
                            grade={props.course.grades[idx]?.value || ""}
                          />
                        </TouchableOpacity>
                    )}
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
