import { View, Text } from "react-native";
import React, { useContext } from "react";
import { Course, DataContext } from "scorecard-types";
import MediumText from "../../text/MediumText";
import { useTheme } from "@react-navigation/native";
import ArchiveCourseChip from "./ArchiveCourseChip";
export default function ArchiveCourseCard(props: {
  course: Course;
  cellCount: number;
}) {
  const data = useContext(DataContext);
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 20,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          marginVertical: 12,
          marginHorizontal: 24,
        }}
      >
        <MediumText
          style={{
            fontSize: 16,
          }}
        >
          {data.courseSettings[props.course.key]?.displayName ||
            props.course.name}
        </MediumText>
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
                      backgroundColor: "white",
                      height: 52,
                    }}
                  >
                    {props.course.grades[idx]?.value != null && (
                      <ArchiveCourseChip
                        accentColorLabel={
                          data.courseSettings[props.course.key]?.accentColor ||
                          "blue"
                        }
                        active={props.course.grades[idx]?.active || false}
                        grade={props.course.grades[idx]?.value || ""}
                      />
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
