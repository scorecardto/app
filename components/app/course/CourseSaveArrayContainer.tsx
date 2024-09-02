import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CourseCornerButton from "./CourseCornerButton";
import useColors from "../../core/theme/useColors";
import useAccents from "../../core/theme/useAccents";
import Toast from "react-native-toast-message";
import LoadingOverlay from "../../screens/loader/LoadingOverlay";
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

  const [waitingForSave, setWaitingForSave] = useState(false);

  useEffect(() => {
    if (waitingForSave && !props.canSave && !props.saving) {
      setWaitingForSave(false);
      props.onPressLeft();
    }
  }, [props.canSave, props.saving]);
  const attemptClose = useCallback(() => {
    if (props.save && (props.canSave || props.saving)) {
      setWaitingForSave(true);
      const timeout = setTimeout(() => {
        setWaitingForSave((w) => {
          if (w) {
            props.onPressLeft();
            Toast.show({
              type: "info",
              text1: "Changes not saved",
              text2: "Something went wrong saving your changes.",
            });
          }
          return false;
        });
      }, 3500);
    } else {
      props.onPressLeft();
    }
  }, [props.saving, props.canSave, props.save]);
  return (
    <>
      <View
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          zIndex: waitingForSave ? 50 : 0,
        }}
        pointerEvents="none"
      >
        <LoadingOverlay show={waitingForSave} />
      </View>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 24,
          borderBottomColor: "black",
          backgroundColor: colors.background,
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
            onPress={() => {
              attemptClose();
            }}
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
    </>
  );
}
