import {View, TouchableOpacity, Text, Alert} from "react-native";
import { Ref, forwardRef, useCallback, useState } from "react";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../core/state/store";
import useColors from "../../core/theme/useColors";
import {Club, ClubEnrollmentBase, ClubMembershipBase} from "scorecard-types";
import { useNavigation } from "@react-navigation/native";
import LoaderKit from "react-native-loader-kit";
import useScApi from "../../util/hooks/useScApi";
import useSocial from "../../util/hooks/useSocial";
import SmallText from "../../text/SmallText";

const ManageClubMemberSheet = forwardRef(
  (
    props: {
      club: Club;
      member?: ClubMembershipBase;
      enrollment?: ClubEnrollmentBase;
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
            action: props.member!.manager ? "DEMOTE" : "PROMOTE",
            membershipId: props.member!.id,
          },
        })
        .finally(() => {
          setLoading(false);
          props.reload();
        });
    }, [loading, props.member?.manager]);
    const first = (props.member?.firstName ?? props.enrollment!.firstName)?.replace("null", "") ?? '';
    const last = (props.member?.lastName ?? props.enrollment!.lastName)?.replace("null", "") ?? '';
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
          {`${first} ${last}`.trim() ||
            "Club Member"}
        </BottomSheetHeader>

          {!props.member && <SmallText style={{
              color: colors.text
          }}>
              Must be a Scorecard user.
          </SmallText>}
        <TouchableOpacity
          style={{
            marginBottom: 12,
              opacity: !props.member ? 0.2 : 1,
          }}
          disabled={!props.member}
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
                {props.member?.manager ? "Remove as Manager" : "Add as Manager"}
              </Text>
            )}
          </View>
        </TouchableOpacity>
          <TouchableOpacity
              style={{marginBottom: 12,}}
              onPress={() => {
                  Alert.alert("Remove Member", `Are you sure you want to remove ${(first+' '+last).trim() || 'this member'}?`, [
                      {
                          text: "Cancel",
                          style: "cancel",
                          isPreferred: true,
                      },
                      {
                          text: "Remove",
                          style: "destructive",
                          onPress: async() => {
                              setLoading(true);
                              scApi
                                  .post({
                                      pathname: "/v1/clubs/changeMember",
                                      auth: true,
                                      body: {
                                          internalCode: props.club.internalCode,
                                          action: "REMOVE",
                                          membershipId: props.member?.id,
                                          enrollmentEmail: props.enrollment?.email,
                                      },
                                  })
                                  .finally(() => {
                                      setLoading(false);
                                      props.reload();
                                  });
                              props.reload();
                          }
                      }
                  ]);
              }}
          >
              <View
                  style={{
                      backgroundColor: '#e44c46',
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
                          Remove Member
                      </Text>
                  )}
              </View>
          </TouchableOpacity>
      </ActionSheet>
    );
  }
);

export default ManageClubMemberSheet;
