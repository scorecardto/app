import { View, TouchableOpacity, Text } from "react-native";
import { Ref, forwardRef, useCallback, useState } from "react";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../core/state/store";
import useColors from "../../core/theme/useColors";
import { Club, ClubMembershipBase } from "scorecard-types";
import { useNavigation } from "@react-navigation/native";
import LoaderKit from "react-native-loader-kit";
import useScApi from "../../util/hooks/useScApi";

const ManageClubMemberSheet = forwardRef(
  (
    props: {
      club: Club;
      member: ClubMembershipBase;
      reload(): void;
    },
    ref: Ref<ActionSheetRef>
  ) => {
    const dispatch = useDispatch<AppDispatch>();

    const navigation = useNavigation();

    const colors = useColors();

    const scApi = useScApi();

    const [loading, setLoading] = useState(false);

    const changeManagerStatus = useCallback(() => {
      if (loading) return;
      setLoading(true);
      scApi
        .post({
          pathname: "/v1/clubs/changeMember",
          auth: true,
          body: {
            internalCode: props.club.internalCode,
            action: props.member.manager ? "DEMOTE" : "PROMOTE",
            membershipId: props.member.id,
          },
        })
        .finally(() => {
          setLoading(false);
          props.reload();
        });
    }, [loading, props.member.manager]);
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
        <BottomSheetHeader>
          {`${props.member.firstName} ${props.member.lastName}`.trim() ||
            "Club Member"}
        </BottomSheetHeader>

        <TouchableOpacity
          style={{
            marginBottom: 12,
          }}
          onPress={() => {
            changeManagerStatus();
          }}
        >
          <View
            style={{
              backgroundColor: "#2C74BE",
              paddingVertical: 12,
              width: "100%",
              borderRadius: 16,
              alignItems: "center",
              height: 48,
              justifyContent: "center",
            }}
          >
            {loading ? (
              <LoaderKit
                style={{ width: 16, height: 16 }}
                name={"LineScalePulseOut"}
                color={"white"}
              />
            ) : (
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                {props.member.manager ? "Remove as Manager" : "Add as Manager"}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </ActionSheet>
    );
  }
);

export default ManageClubMemberSheet;
