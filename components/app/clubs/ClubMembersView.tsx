import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ClubSocialPreview from "./ClubSocialPreview";
import ClubQRCodePreview from "./ClubQRCodePreview";
import MediumText from "../../text/MediumText";
import useColors from "../../core/theme/useColors";
import { Club, ClubEnrollmentBase, ClubMembershipBase } from "scorecard-types";
import LargeText from "../../text/LargeText";
import useScApi from "../../util/hooks/useScApi";
import { ActionSheetRef } from "react-native-actions-sheet";
import ManageClubMemberSheet from "./ManageClubMemberSheet";
import useIsDarkMode from "../../core/theme/useIsDarkMode";
import { MaterialIcons } from "@expo/vector-icons";
export function MemberRow(props: {
  club: Club;
  member: ClubMembershipBase;
  index: number;
  reload(): void;
}) {
  const m = props.member;
  const i = props.index;

  const colors = useColors();

  const sheetRef = useRef<ActionSheetRef>(null);

  const isDark = useIsDarkMode();

  return (
    <>
      <ManageClubMemberSheet
        ref={sheetRef}
        member={m}
        club={props.club}
        reload={() => {
          sheetRef.current?.hide();
          props.reload();
        }}
      />
      <TouchableOpacity
        disabled={!props.club.isOwner || m.owner}
        onPress={() => {
          sheetRef.current?.show();
        }}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderBottomWidth: 2,
            borderBottomColor: colors.border,
            paddingVertical: 12,
            paddingHorizontal: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  marginRight: 12,
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.backgroundNeutral,
                    width: 20,
                    height: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 16,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.text,
                    }}
                  >
                    {i + 1}
                  </Text>
                </View>
              </View>
              <View>
                <MediumText
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                  }}
                >
                  {m.firstName} {m.lastName}
                </MediumText>
                <Text
                  style={{
                    color: colors.text,
                  }}
                >
                  {m.email}
                </Text>
                {!!m.owner && (
                  <View
                    style={{
                      backgroundColor: isDark ? "#702130" : "#ffcfcf",
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      alignSelf: "flex-start",
                      borderRadius: 4,
                      marginTop: 8,
                    }}
                  >
                    <MediumText
                      style={{
                        color: colors.primary,
                        fontSize: 12,
                      }}
                    >
                      Owner
                    </MediumText>
                  </View>
                )}
                {!!m.manager && (
                  <View
                    style={{
                      backgroundColor: isDark ? "#134518" : "#ebf5ce",
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      alignSelf: "flex-start",
                      borderRadius: 4,
                      marginTop: 8,
                    }}
                  >
                    <MediumText
                      style={{
                        color: colors.primary,
                        fontSize: 12,
                      }}
                    >
                      Manager
                    </MediumText>
                  </View>
                )}
              </View>
            </View>
            {props.club.isOwner && !m.owner && (
              <View style={{}}>
                <MaterialIcons
                  name="chevron-right"
                  color={colors.text}
                  size={24}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}
export default function ClubMembersView(props: { club: Club }) {
  const colors = useColors();

  const [members, setMembers] = useState<ClubMembershipBase[]>([]);
  const [enrollments, setEnrollments] = useState<ClubEnrollmentBase[]>([]);
  const [loading, setLoading] = useState(true);

  const scApi = useScApi();
  const refresh = useCallback(() => {
    scApi
      .get({
        pathname: "/v1/clubs/members",
        auth: true,
        params: {
          internalCode: props.club.internalCode,
        },
      })
      .then((r) => {
        setMembers(r.data.members);
        setEnrollments(r.data.enrollments);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    refresh();
  }, []);
  return (
    <View
      style={{
        paddingHorizontal: 4,
      }}
    >
      <LargeText
        style={{
          color: colors.primary,
        }}
      >
        {props.club.memberCount} Member
        {props.club.memberCount === 1 ? "" : "s"}
      </LargeText>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <View>
            <Text
              style={{
                color: colors.text,
              }}
            >
              {members.length} joined with Scorecard.
            </Text>
            <Text
              style={{
                color: colors.text,
              }}
            >
              {enrollments.length} imported.
            </Text>
            <MediumText
              style={{
                fontSize: 18,
                color: colors.primary,
                marginBottom: 8,
                marginTop: 24,
              }}
            >
              Scorecard Members
            </MediumText>
            <View
              style={{
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {members.map((m, i) => {
                return (
                  <MemberRow
                    reload={refresh}
                    club={props.club}
                    member={m}
                    index={i}
                  />
                );
              })}
            </View>
            <MediumText
              style={{
                fontSize: 18,
                color: colors.primary,
                marginBottom: 8,
                marginTop: 24,
              }}
            >
              Imported Members
            </MediumText>
            <View
              style={{
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {enrollments.map((m, i) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: colors.card,
                      borderBottomWidth: 2,
                      borderBottomColor: colors.border,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        marginRight: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.text,
                        }}
                      >
                        {members.length + i + 1}
                      </Text>
                    </View>
                    <View>
                      {m.firstName && (
                        <MediumText
                          style={{
                            color: colors.primary,
                            fontSize: 16,
                          }}
                        >
                          {m.firstName} {m.lastName}
                        </MediumText>
                      )}
                      <Text
                        style={{
                          color: m.firstName ? colors.text : colors.primary,
                        }}
                      >
                        {m.email}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </>
      )}
    </View>
  );
}
