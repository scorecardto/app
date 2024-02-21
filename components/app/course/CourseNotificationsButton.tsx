import { View, Text } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CourseCornerButton from "./CourseCornerButton";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import * as Notifications from "expo-notifications";
import Toast from "react-native-toast-message";
export default function CourseNotificationsButton(props: {
  courseKey: string;
  onPress: () => void;
}) {
  const notificationSettings = useSelector((r: RootState) => {
    return r.notificationSettings[props.courseKey];
  });

  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      style={[
        {
          zIndex: 50,
          position: "absolute",
          top: insets.top + 12,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        },
      ]}
    >
      <CourseCornerButton
        side={"right"}
        icon={
          notificationSettings === "ON_ALWAYS"
            ? "notifications"
            : notificationSettings === "ON_ONCE"
            ? "alarm"
            : "notifications-off"
        }
        iconPadding={18}
        iconSize={30}
        onPress={() => {
          Notifications.getPermissionsAsync().then((permissions) => {
            if (permissions.status === "granted") {
              props.onPress();
            } else {
              if (permissions.canAskAgain) {
                Notifications.requestPermissionsAsync().then((r) => {
                  if (r.status === "granted") {
                    props.onPress();
                  } else {
                    Toast.show({
                      type: "info",
                      text1: "Enable Notifications",
                      text2:
                        "You must allow notifications to use this feature. Use the settings app to enable notifications for Scorecard.",
                    });
                  }
                });
              } else {
                Toast.show({
                  type: "info",
                  text1: "Enable Notifications",
                  text2:
                    "You must allow notifications to use this feature. Use the settings app to enable notifications for Scorecard.",
                });
              }
            }
          });
        }}
      />
    </View>
  );
}
