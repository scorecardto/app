import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CourseCornerButton from "./CourseCornerButton";
import useColors from "../../core/theme/useColors";
import useAccents from "../../core/theme/useAccents";
export default function CourseSaveArrayContainer(props: {
  onPressLeft: () => void;
  onPressRight: () => void;
  hideRight?: boolean;
  canSave?: boolean;
  saving?: boolean;
  save: boolean;
}) {
  const insets = useSafeAreaInsets();
  const accents = useAccents();
  const colors = useColors();
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 24,
        borderBottomColor: "black",
        backgroundColor: colors.background,
        shadowColor: "#000000",
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowRadius: 4,
        shadowOpacity: props.save ? 0.2 : 0,
      }}
    >
      <View
        pointerEvents="box-none"
        style={[
          {
            zIndex: 50,
            paddingTop: 32,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <CourseCornerButton
          side={"left"}
          icon={"close"}
          iconPadding={0}
          iconSize={28}
          onPress={() => props.onPressLeft()}
        />
        {props.save && (
          <TouchableOpacity>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontStyle: "italic",
                  color: colors.text,
                }}
              >
                {props.saving
                  ? "Saving..."
                  : props.canSave
                  ? "Waiting..."
                  : "All Changes Saved"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
