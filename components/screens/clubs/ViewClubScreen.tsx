import { View, Text, TouchableOpacity, ScrollView, Share } from "react-native";
import { useCallback, useRef, useState } from "react";
import { NavigationProp } from "@react-navigation/native";

import ClubViewArrayContainer from "../../app/clubs/ClubViewArrayContainer";
import ScorecardClubImage from "../../util/ScorecardClubImage";
import { Club } from "scorecard-types";
import useScApi from "../../util/hooks/useScApi";
import MediumText from "../../text/MediumText";
import Color from "color";
import useColors from "../../core/theme/useColors";
import ClubScreenGradient from "../../app/clubs/ClubScreenGradient";
import LargeText from "../../text/LargeText";
import { MaterialIcons } from "@expo/vector-icons";
import ClubPostReader from "../../app/clubs/ClubPostReader";
import ViewClubMenuSheet from "../../app/clubs/ViewClubMenuSheet";
import { ActionSheetRef } from "react-native-actions-sheet";
import Toast from "react-native-toast-message";
import useSocial from "../../util/hooks/useSocial";
import useCachedValue from "../../util/hooks/useCachedValue";
import LoadingContentScreen from "../../util/LoadingContentScreen";
import LoaderKit from "react-native-loader-kit";
import SmallText from "../../text/SmallText";
export default function ViewClubScreen(props: {
  route: any;
  navigation: NavigationProp<any>;
}) {
  const { internalCode } = props.route.params;
  const api = useScApi();

  const [club, loading] = useCachedValue<Club>(
    `club/${internalCode}`,
    async () => {
      const club: Club = (
        await api.get({
          pathname: "/v1/clubs/get",
          params: {
            internalCode,
          },
          auth: true,
        })
      ).data.club;

      return club;
    }
  );

  const colors = useColors();

  const heroColor = club?.heroColor || "#4A93FF";

  function getContrastRatio(color1: Color, color2: Color) {
    const luminance1 = color1.luminosity();
    const luminance2 = color2.luminosity();
    const brightest = Math.max(luminance1, luminance2);
    const darkest = Math.min(luminance1, luminance2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  function darkenUntilContrast(colorHex: string) {
    let color = Color(colorHex);
    const white = Color("#FFFFFF");
    let contrastRatio = getContrastRatio(color, white);

    while (contrastRatio < 4.5) {
      color = color.darken(0.05); // Darken by 10% each step
      contrastRatio = getContrastRatio(color, white);
    }

    return color.hex(); // Return the final color in hex format
  }

  const sheetRef = useRef<ActionSheetRef>(null);

  const social = useSocial();
  const scApi = useScApi();

  const leave = useCallback(() => {
    scApi
      .post({
        auth: true,
        pathname: "/v1/clubs/leave",
        body: {
          internal_code: internalCode,
        },
      })
      .then(() => {
        Toast.show({
          type: "info",
          text1: "You left " + club?.name + ".",
        });
        props.navigation.goBack();
      })
      .catch(() => {
        Toast.show({
          type: "info",
          text1: "Something went wrong.",
        });
      })
      .finally(() => {
        social.refreshClubs();
      });
  }, [club]);

  const [sharing, setSharing] = useState(false);
  if (!club) {
    return <LoadingContentScreen />;
  }

  return (
    <ScrollView
      style={{
        height: "100%",
        width: "100%",
      }}
      contentContainerStyle={{
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <ViewClubMenuSheet
        ref={sheetRef}
        club={club}
        leave={() => {
          leave();
          sheetRef.current?.hide?.();
        }}
        report={() => {
          sheetRef.current?.hide?.();
          props.navigation.navigate("help", {
            reason: "report_post",
            defaultMessage: `Report of #${club.clubCode}. Include other details below:`,
          });
        }}
      />
      <ClubViewArrayContainer
        onPressLeft={() => {
          props.navigation.goBack();
        }}
        onPressRight={() => {}}
      />
      <View
        style={{
          flexShrink: 0,
          flexGrow: 1,
          width: "100%",
          paddingBottom: 16,
        }}
      >
        <ClubScreenGradient color={heroColor} />
        <View
          style={{
            position: "relative",
            paddingTop: 58,
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              position: "absolute",
              top: -58,
              shadowColor: "#000000",
              shadowRadius: 16,
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.1,
            }}
          >
            <View
              style={{
                borderRadius: 16,
                overflow: "hidden",
                width: 116,
                marginHorizontal: 16,
                borderWidth: 4,
                borderColor: "white",
              }}
            >
              <ScorecardClubImage club={club} width={116} height={116} />
            </View>
          </View>
          <View
            style={{
              flexShrink: 1,
              marginTop: 12,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <LargeText
                style={{
                  fontSize: 20,
                  color: colors.primary,
                }}
              >
                {club.name}
              </LargeText>
              {(club.verified || club.official) && (
                <MaterialIcons
                  name="verified"
                  size={20}
                  style={{
                    marginTop: 1,
                    marginLeft: 4,
                    color: club.official ? colors.gold : colors.button,
                  }}
                />
              )}
            </View>
            <Text
              style={{
                color: colors.text,
                fontSize: 14,
              }}
            >
              {club.clubCode} - {club.memberCount} member
              {club.memberCount === 1 ? "" : "s"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "stretch",
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                style={{
                  marginRight: 8,
                }}
                onPress={() => {
                  if (!!club.canManage) {
                    props.navigation.navigate("createClubPost", {
                      club,
                    });
                  } else {
                    setSharing(true);

                    Share.share({
                      message: `https://scorecardgrades.com/joinclub/${club.clubCode}?preferInternalCode=${club.internalCode}`,
                    }).then(() => {
                      setSharing(false);
                    });
                  }
                }}
              >
                <View
                  style={{
                    backgroundColor: darkenUntilContrast(heroColor),
                    height: 40,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    borderRadius: 24,
                    alignSelf: "flex-start",
                  }}
                >
                  <View>
                    {!!club.canManage ? (
                      <MediumText
                        style={{
                          fontSize: 16,
                          color: "white",
                          paddingVertical: 2,
                          textAlign: "center",
                        }}
                      >
                        Post
                      </MediumText>
                    ) : (
                      <View
                        style={{
                          width: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        {sharing ? (
                          <LoaderKit
                            style={{ width: 16, height: 16 }}
                            name={"LineScalePulseOut"}
                            color={"white"}
                          />
                        ) : (
                          <MediumText
                            style={{
                              fontSize: 16,
                              color: "white",
                              paddingVertical: 2,
                              textAlign: "center",
                            }}
                          >
                            Share
                          </MediumText>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              {!!club.canManage && (
                <TouchableOpacity
                  style={{
                    marginRight: 8,
                  }}
                  onPress={() => {
                    if (!!club.canManage) {
                      props.navigation.navigate("clubAdmin", {
                        internalCode,
                      });
                    }
                  }}
                >
                  <View
                    style={{
                      borderColor: colors.borderNeutral,
                      borderWidth: 1,
                      paddingVertical: 8,
                      paddingHorizontal: 20,
                      borderRadius: 24,
                      alignSelf: "flex-start",
                    }}
                  >
                    <SmallText
                      style={{
                        fontSize: 16,
                        color: colors.primary,
                        paddingVertical: 2,
                        textAlign: "center",
                      }}
                    >
                      {"Manage"}
                    </SmallText>
                  </View>
                </TouchableOpacity>
              )}
              {!club.isOwner && (
                <TouchableOpacity
                  onPress={() => {
                    sheetRef.current?.show?.();
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "white",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      borderRadius: 40,
                      overflow: "hidden",
                    }}
                  >
                    <MaterialIcons
                      name="more-horiz"
                      color={"black"}
                      size={24}
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View
            style={{
              marginTop: 16,
            }}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: 14,
              }}
            >
              {club.bio}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          height: "100%",
          flexGrow: 1,
          marginBottom: 32,
          width: "100%",
        }}
      >
        <View
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: colors.backgroundNeutral,
          }}
        >
          {club.posts.length === 0 ? (
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: 16,
              }}
            >
              <MaterialIcons name="pages" size={32} color={colors.text} />
              <MediumText
                style={{
                  fontSize: 24,
                  marginBottom: 4,
                  marginTop: 8,
                  color: colors.text,
                }}
              >
                No Posts
              </MediumText>
              <Text
                style={{
                  color: colors.text,
                }}
              >
                {club.name} hasn't made any posts yet.
              </Text>
            </View>
          ) : (
            club.posts.map((p, i) => {
              return <ClubPostReader key={i} post={p} />;
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}
