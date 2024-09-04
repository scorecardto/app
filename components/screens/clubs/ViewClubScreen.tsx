import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import CourseCornerButtonContainer from "../../app/course/CourseCornerButtonContainer";
import ClubViewArrayContainer from "../../app/clubs/ClubViewArrayContainer";
import ScorecardClubImage from "../../util/ScorecardClubImage";
import { Club } from "scorecard-types";
import useScApi from "../../util/hooks/useScApi";
import MediumText from "../../text/MediumText";
import SmallText from "../../text/SmallText";
import Color from "color";
import useColors from "../../core/theme/useColors";
import ClubScreenGradient from "../../app/clubs/ClubScreenGradient";
import LargeText from "../../text/LargeText";
import { MaterialIcons } from "@expo/vector-icons";
import ClubPostReader from "../../app/clubs/ClubPostReader";
export default function ViewClubScreen(props: {
  route: any;
  navigation: NavigationProp<any>;
}) {
  const [club, setClub] = useState<Club | null>(null);

  const { internalCode } = props.route.params;

  const api = useScApi();

  const fetchClub = useCallback(async () => {
    await api
      .get({
        pathname: "/v1/clubs/get",
        params: {
          internalCode,
        },
        auth: true,
      })
      .then((result) => {
        setClub(result.data.club);
      });
  }, [internalCode]);

  useEffect(() => {
    fetchClub();
  }, []);

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

  if (!club) {
    return <ActivityIndicator />;
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
            <LargeText
              style={{
                fontSize: 20,
                marginTop: 8,
                color: colors.primary,
              }}
            >
              {club.name}
            </LargeText>
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
            <TouchableOpacity
              style={{
                marginRight: 8,
              }}
              onPress={() => {
                props.navigation.navigate("clubAdmin", {
                  internalCode,
                });
              }}
            >
              <View
                style={{
                  backgroundColor: darkenUntilContrast(heroColor),
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  borderRadius: 24,
                  alignSelf: "flex-start",
                }}
              >
                <MediumText
                  style={{
                    fontSize: 16,
                    color: "white",
                    paddingVertical: 2,
                    textAlign: "center",
                  }}
                >
                  Manage
                </MediumText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
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
                <MaterialIcons name="more-horiz" color={"black"} size={24} />
              </View>
            </TouchableOpacity>
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
          {club.posts.map((p, i) => {
            return <ClubPostReader key={i} post={p} />;
          })}
        </View>
      </View>
    </ScrollView>
  );
  // return (
  //   <View
  //     style={{
  //       position: "relative",
  //       height: "100%",
  //       width: "100%",
  //     }}
  //   >
  //     <ScrollView
  //       style={{
  //         zIndex: 10,
  //         height: "100%",
  //       }}
  //     >
  //       <ClubScreenGradient color={heroColor}></ClubScreenGradient>
  //       <View
  //         style={{
  //           flexShrink: 0,
  //         }}
  //       >
  //         <ClubViewArrayContainer
  //           onPressLeft={() => {
  //             props.navigation.goBack();
  //           }}
  //           code={club?.clubCode}
  //           onPressRight={() => {}}
  //         />
  //       </View>
  //       <View style={{ height: "100%" }}>
  //         {club ? (
  //           <View>
  //             <View
  //               style={{
  //                 paddingHorizontal: 16,
  //                 paddingTop: 20,
  //               }}
  //             >
  //               <View
  //                 style={{
  //                   borderRadius: 16,
  //                   overflow: "hidden",
  //                   width: 116,
  //                   marginRight: 16,
  //                   borderWidth: 4,
  //                   borderColor: "white",
  //                 }}
  //               >
  //                 <ScorecardClubImage club={club} width={116} height={116} />
  //               </View>
  //               <View
  //                 style={{
  //                   flexShrink: 1,
  //                   marginTop: 4,
  //                   marginBottom: 16,
  //                 }}
  //               >
  //                 <LargeText
  //                   style={{
  //                     fontSize: 20,
  //                     marginTop: 8,
  //                     color: colors.primary,
  //                   }}
  //                 >
  //                   {club.name}
  //                 </LargeText>
  //                 <Text
  //                   style={{
  //                     color: colors.text,
  //                     fontSize: 14,
  //                   }}
  //                 >
  //                   {club.clubCode} - {club.memberCount} member
  //                   {club.memberCount === 1 ? "" : "s"}
  //                 </Text>
  //               </View>
  //               <View
  //                 style={{
  //                   flexDirection: "row",
  //                   justifyContent: "space-between",
  //                   alignItems: "stretch",
  //                 }}
  //               >
  //                 <TouchableOpacity
  //                   style={{
  //                     marginRight: 8,
  //                   }}
  //                   onPress={() => {
  //                     props.navigation.navigate("clubAdmin", {
  //                       internalCode,
  //                     });
  //                   }}
  //                 >
  //                   <View
  //                     style={{
  //                       backgroundColor: darkenUntilContrast(heroColor),
  //                       paddingVertical: 8,
  //                       paddingHorizontal: 20,
  //                       borderRadius: 24,
  //                       alignSelf: "flex-start",
  //                     }}
  //                   >
  //                     <MediumText
  //                       style={{
  //                         fontSize: 16,
  //                         color: "white",
  //                         paddingVertical: 2,
  //                         textAlign: "center",
  //                       }}
  //                     >
  //                       Manage
  //                     </MediumText>
  //                   </View>
  //                 </TouchableOpacity>
  //                 <TouchableOpacity>
  //                   <View
  //                     style={{
  //                       width: 40,
  //                       height: 40,
  //                       backgroundColor: "white",
  //                       justifyContent: "center",
  //                       alignItems: "center",
  //                       flexDirection: "row",
  //                       borderRadius: 40,
  //                       overflow: "hidden",
  //                     }}
  //                   >
  //                     <MaterialIcons
  //                       name="more-horiz"
  //                       color={"black"}
  //                       size={24}
  //                     />
  //                   </View>
  //                 </TouchableOpacity>
  //               </View>
  //               <View
  //                 style={{
  //                   marginTop: 16,
  //                 }}
  //               >
  //                 <Text
  //                   style={{
  //                     color: colors.primary,
  //                     fontSize: 14,
  //                   }}
  //                 >
  //                   {club.bio}
  //                 </Text>
  //               </View>
  //             </View>
  //             <View
  //               style={{
  //                 flexGrow: 1,
  //                 padding: 16,
  //                 backgroundColor: colors.backgroundNeutral,
  //                 flex: 1,
  //                 height: "100%",
  //               }}
  //             >
  //               <Text>{club?.posts.length}</Text>
  //             </View>
  //           </View>
  //         ) : (
  //           <>
  //             <ActivityIndicator />
  //           </>
  //         )}
  //       </View>
  //     </ScrollView>
  //   </View>
  // );
}
