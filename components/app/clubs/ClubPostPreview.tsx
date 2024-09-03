import { View, Text, TouchableOpacity } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { ClubPost } from "scorecard-types";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInSeconds,
  differenceInDays,
} from "date-fns";
import useColors from "../../core/theme/useColors";
import Color from "color";
import MediumText from "../../text/MediumText";
import ScorecardClubImage from "../../util/ScorecardClubImage";
import ScorecardImage from "../../util/ScorecardImage";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
export default function ClubPostPreview(props: { post: ClubPost }) {
  const colors = useColors();

  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const i = setInterval(() => {
      setTime(Date.now());
    }, 1000 * 60);
    return () => {
      clearInterval(i);
    };
  }, []);

  const eventLabel = useMemo(() => {
    if (!props.post.eventDate) {
      return null;
    }
    const date = new Date(props.post.eventDate);
    const now = new Date(time);

    const timeDifferenceInMinutes = differenceInMinutes(date, now);
    const timeDifferenceInHours = differenceInHours(date, now);
    const timeDifferenceInSeconds = differenceInSeconds(date, now);
    const timeDifferenceInDays = differenceInDays(date, now);

    if (timeDifferenceInSeconds < 0 && timeDifferenceInMinutes > -60) {
      return "Happening Now";
    } else if (timeDifferenceInSeconds >= 0 && timeDifferenceInMinutes < 60) {
      const minutes = Math.abs(timeDifferenceInMinutes);
      const seconds = Math.abs(timeDifferenceInSeconds % 60);
      return `in ${minutes} min${minutes === 1 ? "" : "s"}`;
    } else if (timeDifferenceInHours < 36 && timeDifferenceInHours >= 1) {
      const hours = Math.abs(timeDifferenceInHours);
      const minutes = Math.abs(timeDifferenceInMinutes % 60);
      return `in ${hours}h ${minutes}m`;
    } else if (timeDifferenceInHours >= 36 && timeDifferenceInDays < 7) {
      const days = Math.abs(timeDifferenceInDays);
      return `in ${days} days`;
    } else if (timeDifferenceInDays >= 7) {
      return `on ${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;
    } else if (date > now) {
      return undefined;
    }
  }, [props.post.eventDate, time]);

  const navigation = useNavigation();
  if (props.post.picture) {
    return (
      <TouchableOpacity
        onPress={() => {
          // @ts-ignore
          navigation.navigate("viewClub", {
            internalCode: props.post.club.internalCode,
          });
        }}
      >
        <View
          style={{
            padding: 12,
            borderRadius: 4,
            backgroundColor: colors.card,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <MediumText
              style={{
                fontSize: 18,
                marginBottom: 4,
                color: colors.primary,
              }}
            >
              {props.post.club.name}
            </MediumText>
            <MaterialIcons name="chevron-right" color={colors.text} size={24} />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <View
              style={{
                flexShrink: 0,
              }}
            >
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <ScorecardImage
                  height={120}
                  width={120}
                  id={props.post.picture}
                />
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 4,
                flexShrink: 1,
                marginLeft: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: colors.primary,
                }}
              >
                {props.post.content}
              </Text>
              {eventLabel && (
                <View
                  style={{
                    backgroundColor: Color(props.post.club.heroColor)
                      .mix(Color(colors.card), 0.85)
                      .hex(),
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
                    {eventLabel}
                  </MediumText>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      onPress={() => {
        // @ts-ignore
        navigation.navigate("viewClub", {
          internalCode: props.post.club.internalCode,
        });
      }}
    >
      <View
        style={{
          padding: 12,
          borderRadius: 4,
          backgroundColor: colors.card,
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            flexShrink: 0,
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <ScorecardClubImage height={64} width={64} club={props.post.club} />
          </View>
          {eventLabel && (
            <View
              style={{
                backgroundColor: Color(props.post.club.heroColor)
                  .mix(Color(colors.card), 0.85)
                  .hex(),
                paddingHorizontal: 8,
                paddingVertical: 2,
                alignSelf: "center",
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
                {eventLabel}
              </MediumText>
            </View>
          )}
        </View>
        <View
          style={{
            paddingHorizontal: 4,
            flexShrink: 1,
            marginLeft: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <MediumText
              style={{
                fontSize: 18,
                marginBottom: 4,
                color: colors.primary,
              }}
            >
              {props.post.club.name}
            </MediumText>
            <MaterialIcons name="chevron-right" color={colors.text} size={24} />
          </View>
          <Text
            style={{
              fontSize: 16,
              color: colors.primary,
            }}
          >
            {props.post.content}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
