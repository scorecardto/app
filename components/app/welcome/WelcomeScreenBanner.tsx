import { View, Text, Animated } from "react-native";
import React, { useEffect, useMemo } from "react";
import * as Svg from "react-native-svg";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";

const icon = require("../../../assets/icon.svg");
export default function WelcomeScreenBanner(props: {
  height: number;
  show: boolean;
}) {
  const positionAnimation = useMemo(() => new Animated.Value(props.height), []);
  const opacityAnimation = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    if (!props.show) {
      Animated.timing(positionAnimation, {
        toValue: 60,
        duration: 150,
        useNativeDriver: false,
      }).start();

      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(positionAnimation, {
        toValue: props.height,
        duration: 150,
        useNativeDriver: false,
      }).start();

      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [props.show]);

  const { colors } = useTheme();

  return (
    <Animated.View
      style={{
        height: 0,
        overflow: "visible",
        marginBottom: positionAnimation,
      }}
    >
      <Animated.View
        style={{
          height: props.height,
          width: "100%",
          opacity: opacityAnimation,
        }}
      >
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            zIndex: 100,
          }}
        >
          <Image
            source={icon}
            style={{
              height: "40%",
              aspectRatio: 1,
            }}
          />
        </View>
        <Svg.Svg height="100%" width="100%" viewBox="0 0 100 100">
          <Svg.Circle cx="-10" cy="0" r="65" fill={colors.secondary} />
          <Svg.Circle cx="125" cy="0" r="100" fill={colors.secondary} />
        </Svg.Svg>
      </Animated.View>
    </Animated.View>
  );
}
