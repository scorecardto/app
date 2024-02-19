import { View, Text, Animated, TouchableOpacity } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../core/state/store";

export default function CountdownButton(props: {
  onPress: () => void;
  forceEnable?: boolean;
}) {
  const secsSinceOpen = useSelector(
    (s: RootState) => {
      const now = new Date();
      return s.invitedNumbers.openInviteSheetDate
        ? Math.floor(
            (now.getTime() - s.invitedNumbers.openInviteSheetDate) / 1000
          )
        : 0;
    },
    () => true
  );

  const progress = useMemo(
    () => new Animated.Value(Math.min(1, Math.max(0, secsSinceOpen / 90))),
    []
  );

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1000 * (90 - secsSinceOpen),
      useNativeDriver: true,
      easing: (t) => Math.pow(t, 0.9),
    }).start();
  }, []);

  const [width, setWidth] = useState(0);

  return (
    <View
      onLayout={(e) => {
        setWidth(e.nativeEvent.layout.width);
      }}
      style={{
        alignSelf: "center",
      }}
    >
      {props.forceEnable ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 0, 0, 0.5)",
          }}
        />
      ) : (
        <></>
      )}
      <TouchableOpacity
        disabled={secsSinceOpen > 90 && !props.forceEnable}
        onPress={props.onPress}
      >
        <View
          style={{
            position: "relative",
            width: "100%",
            backgroundColor: "#35262A",

            overflow: "hidden",
            borderRadius: 100,
          }}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "#9A9294",

                width: "100%",
                height: "100%",
                transform: [
                  {
                    translateX: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [width, 0],
                    }),
                  },
                ],
              },
            ]}
          />
          <View
            style={{
              paddingVertical: 12,
              paddingHorizontal: 64,
              alignContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "500",
                color: "white",
                textAlign: "center",
              }}
            >
              Invite to get early
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
