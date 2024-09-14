import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useColors from "../../core/theme/useColors";
import LargeText from "../../text/LargeText";
import MediumText from "../../text/MediumText";
import { Club } from "scorecard-types";
import { MaterialIcons } from "@expo/vector-icons";
import useSocial from "../../util/hooks/useSocial";
import Toast from "react-native-toast-message";
import useScApi from "../../util/hooks/useScApi";
import { useNavigation } from "@react-navigation/native";
import ScorecardClubImage from "../../util/ScorecardClubImage";
import useGetEmail from "../../util/hooks/useGetEmail";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import ScorecardModule from "../../../lib/expoModuleBridge";

export default function ClubPreview(props: { club: Club }) {
  const colors = useColors();

  const social = useSocial();

  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const getEmail = useGetEmail();

  const email = useSelector((r: RootState) => r.social.preferredEmail);

  const api = useScApi();
  const join = useCallback(async () => {
    getEmail().then((email: string) => {
      console.log(email);

      if (props.club.isMember) return;

      setLoading(true);

      console.log({
        email,
        internalCode: props.club.internalCode,
      });

      api
        .post({
          pathname: "/v1/clubs/join",
          auth: true,
          body: {
            email,
            internalCode: props.club.internalCode,
          },
        })
        .then(() => {
          Toast.show({
            type: "info",
            text1: `Welcome to ${props.club.name}!`,
            text2: `You are now a member of this club.`,
          });
          // @ts-ignore
          navigation.navigate("viewClub", {
            internalCode: props.club.internalCode,
          });
        })
        .catch((e) => {
          console.error(e);

          Toast.show({
            type: "info",
            text1: `Error Occured`,
            text2: `Something went wrong trying to join this club.`,
          });
        })
        .finally(() => {
          social.refreshClubs().then(() => {
            setLoading(false);
          });
        });
    });
  }, [props.club]);

    const PADDING = 12;
    const IMAGE_SIZE = 60;
    return (
        <View
            style={{
                paddingHorizontal: PADDING,
                paddingVertical: PADDING,
                borderBottomColor: colors.background,
                borderBottomWidth: 2,
            }}
        >
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.navigate("viewClub", {
                internalCode: props.club.internalCode,
              });
            }}
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
            }}
          >
              <View
                  style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      flexShrink: 1,
                      flexGrow: 0,
                      overflow: "hidden",
                  }}
              >
                  <View
                      style={{
                          height: IMAGE_SIZE,
                          width: IMAGE_SIZE,
                          borderRadius: 8,
                          overflow: "hidden",
                          backgroundColor: "gray",
                      }}
                  >
                      <ScorecardClubImage club={props.club} height={IMAGE_SIZE} width={IMAGE_SIZE} />
                  </View>
                  <View
                      style={{
                          paddingLeft: 16,
                          flexShrink: 1,
                      }}
                  >
                      <View
                          style={{
                              flexDirection: "row",
                              marginBottom: 4,
                              alignItems: "center",
                          }}
                      >
                          {(props.club.verified || props.club.official) && (
                              <MaterialIcons
                                  name="verified"
                                  size={16}
                                  style={{
                                      marginRight: 4,
                                      color: props.club.official ? colors.gold : colors.button,
                                      flexShrink: 0,
                                      flexGrow: 0,
                                  }}
                              />
                          )}
                          <View style={{
                              flexShrink: 1,
                          }}>
                              <MediumText
                                  style={{
                                      fontSize: 18,
                                      color: colors.primary,
                                      marginRight: 4,
                                      overflow: "hidden",
                                  }}
                                  ellipsizeMode={"tail"}
                                  numberOfLines={1}
                              >
                                  {props.club.name}
                              </MediumText>
                          </View>
                      </View>
                      <Text
                          style={{
                              fontSize: 14,
                              color: colors.text,
                          }}
                      >
                          {props.club.clubCode} - {props.club.memberCount} member
                          {props.club.memberCount === 1 ? "" : "s"}
                      </Text>
                  </View>
              </View>
              <View
                  style={{
                      flexShrink: 0,
                      flexGrow: 0,
                      marginLeft: props.club.isMember ? 0 : 90,
                        justifyContent: "center",
                      height: IMAGE_SIZE,
                  }}
              >
                  {props.club.isMember ? (
                      <MaterialIcons name="chevron-right" color={colors.text} size={24} />
                  ) : undefined}
              </View>
            </TouchableOpacity>
            {!props.club.isMember ? (
                <View style={{
                    position: "absolute",
                    right: PADDING,
                    height: IMAGE_SIZE + 2 * PADDING,
                    justifyContent: "center",
                }}>
                    <TouchableOpacity onPress={join}
                                      style={{
                                          paddingHorizontal: 12,
                                          paddingVertical: 4,
                                          borderRadius: 16,
                                          backgroundColor: colors.button,
                                          alignSelf: "flex-end",
                                          flexDirection: "row",
                                          alignItems: "center",
                                      }}>
                        <MaterialIcons
                            name="person-add"
                            size={16}
                            style={{
                                color: "white",
                                marginRight: 8,
                            }}
                        />
                        <LargeText
                            style={{
                                fontSize: 18,
                                color: "white",
                            }}
                        >
                            Join
                        </LargeText>
                    </TouchableOpacity>
                </View>
            ) : undefined}
        </View>
    );
}
