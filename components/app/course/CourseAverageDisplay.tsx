import { View, Text } from "react-native";
import React from "react";
import useColors from "../../core/theme/useColors";
import useAccents from "../../core/theme/useAccents";
import SmallText from "../../text/SmallText";
import { MaterialIcons } from "@expo/vector-icons";
export default function CourseAverageDisplay(props: {
  average?: string;
  modifiedAverage?: string;
  active: boolean;
}) {
  const colors = useColors();
  const accents = useAccents();
  return (
    <View
      style={{
        borderRadius: 8,
        marginTop: 16,
        marginBottom: 20,
        overflow: "hidden",
        backgroundColor: colors.card,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
    >
      <SmallText
        style={{
          fontSize: 16,
          color: colors.primary,
        }}
      >
        {props.modifiedAverage ? "Grade Testing" : "Average"}
      </SmallText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: props.modifiedAverage
              ? colors.secondaryNeutral
              : props.active ? accents.primary : accents.secondary,
            paddingVertical: 4,
            paddingLeft: 16,
            paddingRight: props.active ? 16 : 10,
            borderRadius: 99,
          }}
        >
            <View style={{
                alignSelf: "flex-start",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
            }}>

            <Text
            style={{
              fontSize: 16,
              color: props.modifiedAverage ? colors.text : props.active ? "#FFFFFF" : accents.primary,
            }}
          >
            {props.average}
          </Text>
                {!props.active && <MaterialIcons style={{
                    paddingLeft: 4,
                }} name="check" size={16} color={props.modifiedAverage ? colors.text : accents.primary} />}
            </View>
        </View>
        {props.modifiedAverage && (
          <>
            <MaterialIcons
              name="arrow-forward"
              style={{
                color: colors.text,
                marginHorizontal: 12,
              }}
              size={18}
            />
            <View
              style={{
                backgroundColor: accents.primary,
                paddingVertical: 4,
                paddingHorizontal: 16,
                borderRadius: 99,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                }}
              >
                {props.modifiedAverage}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
