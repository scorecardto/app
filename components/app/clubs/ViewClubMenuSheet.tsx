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
import { useNavigation } from "@react-navigation/native";
const starred = require("../../../assets/starred.svg");

const ViewClubMenuSheet = forwardRef(
  (
    props: {
      club: Club;
      join(): void;
      leave(): void;
      report(): void;
    },
    ref: Ref<ActionSheetRef>
  ) => {
    const dispatch = useDispatch<AppDispatch>();

    const navigation = useNavigation();

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

        {!props.club.isMember ? <TouchableOpacity style={{
            marginBottom: 12,
        }} onPress={props.join}>
            <View
                style={{
                    backgroundColor: colors.button,
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
                    Join
                </Text>
            </View>
        </TouchableOpacity> : undefined}

        <TouchableOpacity
          onPress={() => {
            props.report();
          }}
        >
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
              Report
            </Text>
          </View>
        </TouchableOpacity>

        {props.club.isMember ? <TouchableOpacity style={{
            marginTop: 12,
        }} onPress={props.leave}>
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
        </TouchableOpacity> : undefined}
      </ActionSheet>
    );
  }
);

export default ViewClubMenuSheet;
