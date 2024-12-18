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
import Share from "react-native-share";
import * as FileSystem from "expo-file-system";
export function EnrollmentRow(props: {
    club: Club;
    enrollment: ClubEnrollmentBase;
    index: number;
    reload(): void;
}) {
    const e = props.enrollment;
    const i = props.index;

    const colors = useColors();
    const sheetRef = useRef<ActionSheetRef>(null);
    const isDark = useIsDarkMode();

    return (
        <>
            <ManageClubMemberSheet
                ref={sheetRef}
                enrollment={e}
                club={props.club}
                reload={() => {
                    sheetRef.current?.hide();
                    props.reload();
                }}
            />
            <TouchableOpacity
                onPress={() => {
                    sheetRef.current?.show();
                }}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: colors.card,
                    borderBottomWidth: 2,
                    borderBottomColor: colors.border,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
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
                            {i + 1}
                        </Text>
                    </View>
                    <View>
                        {e.firstName && (
                            <MediumText
                                style={{
                                    color: colors.primary,
                                    fontSize: 16,
                                }}
                            >
                                {e.firstName} {e.lastName}
                            </MediumText>
                        )}
                        <Text
                            style={{
                                color: e.firstName ? colors.text : colors.primary,
                            }}
                        >
                            {e.email}
                        </Text>
                    </View>
                </View>
                <View>
                    <MaterialIcons
                        name="chevron-right"
                        color={colors.text}
                        size={24}
                    />
                </View>
            </TouchableOpacity>
        </>
    )
}

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
              <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
              }}>
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
                  </View>
                  <TouchableOpacity
                      onPress={async () => {
                          let data = "Email,Last Name,First Name,Is Manager,Has Scorecard\n";
                          for (const membership of members) {
                              data += `${membership.email},${membership.lastName},${membership.firstName},${membership.manager},true\n`;
                          }
                          for (const enrollment of enrollments) {
                              data += `${enrollment.email},${enrollment.lastName},${enrollment.firstName},false,false\n`;
                          }

                          const file = FileSystem.cacheDirectory + "members.csv";
                          await FileSystem.writeAsStringAsync(file, data);
                          await Share.open({
                                url: file,
                                filename: "members.csv",
                                title: "members.csv",
                                type:'text/csv',
                                message: 'CSV list of member data',
                              failOnCancel: false,
                          })
                      }}
                      style={{
                          backgroundColor: colors.secondary,
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderRadius: 10,
                      }}
                  >
                      <Text
                          style={{
                              fontSize: 16,
                              color: colors.button
                          }}
                      >
                          Export
                      </Text>
                  </TouchableOpacity>
              </View>
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
                    <EnrollmentRow club={props.club} enrollment={m} index={members.length+i} reload={refresh} />
                );
              })}
            </View>
          </View>
        </>
      )}
    </View>
  );
}
