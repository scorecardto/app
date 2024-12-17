import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ClubPost } from "scorecard-types";
import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  differenceInMinutes,
  differenceInHours,
  differenceInSeconds,
  isTomorrow,
} from "date-fns";
import useColors from "../../core/theme/useColors";
import Color from "color";
import MediumText from "../../text/MediumText";
import ScorecardImage from "../../util/ScorecardImage";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
export default function ClubPostReader(props: { post: ClubPost }) {
  const postedLabel = useMemo(() => {
    const date = new Date(props.post.postDate);
    if (isToday(date) || props.post.postDate > Date.now()) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else if (isThisWeek(date)) {
      return format(date, "EEEE");
    } else {
      return format(date, "MMMM d");
    }
  }, [props.post.postDate]);

  const navigation = useNavigation();

  const [time, setTime] = useState(Date.now());

  const eventLabel = useMemo(() => {
    if (!props.post.eventDate) {
      return null;
    }
    const date = new Date(props.post.eventDate);
    const now = new Date(time);

    const timeDifferenceInMinutes = differenceInMinutes(date, now);
    const timeDifferenceInHours = differenceInHours(date, now);
    const timeDifferenceInSeconds = differenceInSeconds(date, now);

    if (timeDifferenceInSeconds < 0 && timeDifferenceInMinutes > -60) {
      return "Happening Now";
    } else if (timeDifferenceInSeconds >= 0 && timeDifferenceInMinutes < 60) {
      const minutes = Math.abs(timeDifferenceInMinutes);
      const seconds = Math.abs(timeDifferenceInSeconds % 60);
      return `Happening in ${minutes}m ${seconds}s`;
    } else if (timeDifferenceInHours < 24 && timeDifferenceInHours >= 1) {
      const hours = Math.abs(timeDifferenceInHours);
      const minutes = Math.abs(timeDifferenceInMinutes % 60);
      return `Happening in ${hours}h ${minutes}m`;
    } else if (isToday(date)) {
      return "Happened today";
    } else if (isYesterday(date)) {
      return "Happened yesterday";
    } else if (date > now) {
      if (isTomorrow(date)) {
        return `Tomorrow at ${format(date, "h:mm a")}`;
      } else if (isThisWeek(date)) {
        return `Happening ${format(date, "EEEE")}`;
      } else {
        return `Happening ${format(date, "MMMM d")}`;
      }
    } else if (isThisWeek(date)) {
      return `Happened ${format(date, "EEEE")}`;
    } else {
      return `Happened ${format(date, "MMMM d")}`; // e.g., 'Happened July 25th'
    }
  }, [props.post.eventDate, time]);

  useEffect(() => {
    const i = setInterval(() => {
      setTime(Date.now());
    }, 1000);
    return () => {
      clearInterval(i);
    };
  }, []);

  const colors = useColors();

  const screenWidth = Dimensions.get("screen").width;

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        paddingTop: 8,
        paddingBottom: 4,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        marginTop: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ width: 52 }} />
        {eventLabel ? (
          <View
            style={{
              backgroundColor: Color(props.post.club.heroColor)
                .mix(Color(colors.card), 0.7)
                .hex(),
              paddingHorizontal: 8,
              paddingVertical: 2,
              alignSelf: "center",
              borderRadius: 4,
              marginTop: 4,
            }}
          >
            <MediumText
              style={{
                color: colors.primary,
                fontSize: 14,
              }}
            >
              {eventLabel}
            </MediumText>
          </View>
        ) : (
          <Text
            style={{
              color: colors.text,
              textAlign: "center",
              fontSize: 12,
              textTransform: "uppercase",
            }}
          >
            Posted {postedLabel}
          </Text>
        )}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: 52,
          }}
          onPress={() => {
            // @ts-ignore
            navigation.navigate("help", {
              reason: "report_post",
              defaultMessage: `Report of #${
                props.post.club.clubCode
              } for a post made on ${new Date(
                props.post.postDate
              ).toDateString()}. Include other details below:`,
            });
          }}
        >
          <MaterialIcons
            name="report"
            style={{
              color: colors.text,
              marginRight: 2,
            }}
          />
          <Text
            style={{
              color: colors.text,
              textAlign: "center",
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            Report
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingTop: 16,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: colors.primary,
          }}
        >
          {props.post.content}
        </Text>
        {props.post.picture && (
          <View
            style={{
              width: "100%",
              marginTop: 16,
              marginHorizontal: 8,
              aspectRatio: 1,
            }}
          >
            <ScorecardImage
              width={screenWidth - 80}
              height={screenWidth - 80}
              id={props.post.picture}
            />
          </View>
        )}
      </View>
    </View>
  );
}
