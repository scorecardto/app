import { View, TouchableOpacity, Text } from "react-native";
import { Ref, forwardRef } from "react";
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
import Ionicons from "@expo/vector-icons/Ionicons";
import MediumText from "../../text/MediumText";
import { Club } from "scorecard-types";
const starred = require("../../../assets/starred.svg");

const ViewClubMenuSheet = forwardRef(
  (
    props: {
      club: Club;
      leave(): void;
    },
    ref: Ref<ActionSheetRef>
  ) => {
    const dispatch = useDispatch<AppDispatch>();

    const colors = useColors();
    return (
      <ActionSheet
        ref={ref}
        containerStyle={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 8,
          paddingBottom: 16,
          paddingHorizontal: 32,
          backgroundColor: colors.card,
        }}
      >
        <BottomSheetHeader>{props.club.name}</BottomSheetHeader>

        <TouchableOpacity onPress={props.leave}>
          <View
            style={{
              backgroundColor: "#C53131",
              paddingVertical: 12,
              width: "100%",
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                textAlign: "center",
              }}
            >
              Leave
            </Text>
          </View>
        </TouchableOpacity>
      </ActionSheet>
    );
  }
);

export default ViewClubMenuSheet;
