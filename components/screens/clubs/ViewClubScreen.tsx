import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
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

  return (
    <View
      style={{
        height: "100%",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <ClubScreenGradient color={heroColor}></ClubScreenGradient>
      <View
        style={{
          flexShrink: 0,
        }}
      >
        <ClubViewArrayContainer
          onPressLeft={() => {
            props.navigation.goBack();
          }}
          onPressRight={() => {}}
        />
      </View>
      {club ? (
        <View>
          <View
            style={{
              flexDirection: "row",
              overflow: "hidden",
              justifyContent: "flex-start",
              paddingHorizontal: 16,
              paddingTop: 20,
            }}
          >
            <View
              style={{
                borderRadius: 16,
                overflow: "hidden",
                width: 96,
                marginRight: 16,
              }}
            >
              <ScorecardClubImage club={club} width={96} height={96} />
            </View>
            <View
              style={{
                flexShrink: 1,
              }}
            >
              <MediumText
                style={{
                  fontSize: 20,
                  marginBottom: 8,
                  color: colors.primary,
                }}
              >
                {club.name}
              </MediumText>
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
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("clubAdmin", {
                internalCode,
              });
            }}
          >
            <View
              style={{
                backgroundColor: darkenUntilContrast(heroColor),
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                Club Link
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ActivityIndicator />
        </>
      )}
    </View>
  );
}
