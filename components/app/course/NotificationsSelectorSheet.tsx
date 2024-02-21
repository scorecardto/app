import { View, TouchableOpacity } from "react-native";
import { Ref, forwardRef, useState } from "react";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import SmallText from "../../text/SmallText";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../core/state/store";
import { setGradeCategory } from "../../core/state/grades/gradeCategorySlice";
import useColors from "../../core/theme/useColors";
import { getAnalytics } from "@react-native-firebase/analytics";
import { setNotification } from "../../core/state/user/notificationSettingsSlice";
import {
  deregisterNotifs,
  registerNotifs,
} from "../../../lib/backgroundNotifications";

const starred = require("../../../assets/starred.svg");

const NotificationsSelectorSheet = forwardRef(
  (
    props: {
      courseKey: string;
    },
    ref: Ref<ActionSheetRef>
  ) => {
    const options = [
      "Enable Notifications",
      "Enable until the Next Grade Update",
      "Disable Notifications",
    ];
    const colors = useColors();

    const selectedOption = useSelector((r: RootState) => {
      const s = r.notificationSettings[props.courseKey];

      if (s === "ON_ALWAYS") {
        return 0;
      } else if (s === "ON_ONCE") {
        return 1;
      } else {
        return 2;
      }
    });

    const [current, setCurrent] = useState(selectedOption);

    const dispatch = useDispatch<AppDispatch>();

    const displayName = useSelector((r: RootState) => {
      const course = r.gradeData.record?.courses.find(
        (c) => c.key === props.courseKey
      );

      const courseSettingName = r.courseSettings[props.courseKey]?.displayName;

      return courseSettingName || course?.name || "Unknown Course";
    });

    return (
      <ActionSheet
        ref={ref}
        containerStyle={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 8,
          paddingBottom: 16,
          backgroundColor: colors.card,
        }}
      >
        <BottomSheetHeader>Notifcations</BottomSheetHeader>
        {options?.map((opt, idx) => {
          const selected = idx === current;

          return (
            <View
              key={idx}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: colors.borderNeutral,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setCurrent(idx);

                  dispatch(
                    setNotification({
                      key: props.courseKey,
                      value:
                        idx === 0 ? "ON_ALWAYS" : idx === 1 ? "ON_ONCE" : "OFF",
                    })
                  );
                  getAnalytics().logEvent("notification_setting_changed", {
                    course: props.courseKey,
                    setting:
                      idx === 0 ? "ON_ALWAYS" : idx === 1 ? "ON_ONCE" : "OFF",
                  });

                  if (idx === 2) {
                    deregisterNotifs(props.courseKey);
                  } else {
                    registerNotifs(props.courseKey, displayName, idx === 1);
                  }
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 32,
                    backgroundColor: selected
                      ? colors.backgroundNeutral
                      : colors.card,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <SmallText
                    style={{
                      color: colors.primary,
                      paddingVertical: 16,
                    }}
                  >
                    {opt}
                  </SmallText>
                  {selected && (
                    <MaterialIcon
                      name="check"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </ActionSheet>
    );
  }
);

export default NotificationsSelectorSheet;
