import { View, Text, Animated } from "react-native";
import React, { useEffect, useMemo } from "react";
import MediumText from "../../text/MediumText";
import SmallText from "../../text/SmallText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
export default function GiantCourseCard(props: {
  randomIndex: number;
  names: string[];
  colors: string[];
  icons: string[];
  opacity: number;
}) {
  const name = props.names[props.randomIndex % props.names.length];
  const color = props.colors[props.randomIndex % props.colors.length];
  const icon = props.icons[props.randomIndex % props.icons.length];

  const scale = useMemo(() => new Animated.Value(1), []);
  const opacity = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    scale.setValue(0.95),
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
  }, [props.randomIndex]);

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        opacity: opacity,
      }}
    >
      <View
        style={{
          width: "100%",
          height: 54,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "white",
          marginBottom: 16,
          borderRadius: 10,
          overflow: "hidden",
          alignItems: "center",
          opacity: props.opacity,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: color,
              width: 64,
              height: 54,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* @ts-ignore */}
            <MaterialCommunityIcons name={icon} size={24} color="white" />
          </View>
          <MediumText
            style={{
              fontSize: 18,
              paddingLeft: 22,
            }}
          >
            {name}
          </MediumText>
        </View>
        <SmallText
          style={{
            color: "#AAAAAA",
            fontSize: 18,
            paddingRight: 26,
          }}
        >
          100
        </SmallText>
      </View>
    </Animated.View>
  );
}
