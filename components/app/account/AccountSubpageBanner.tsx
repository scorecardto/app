import { View, Text, Animated, Dimensions } from "react-native";
import React, { useEffect, useMemo } from "react";
import * as Svg from "react-native-svg";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";

const icon = require("../../../assets/icon.svg");

export default function AccountSubpageBanner(props: {
  show: boolean;
  padding?: boolean;
}) {
  const windowHeight = Dimensions.get("window").height;
  const height = windowHeight / (props.padding ? 3.75 : 5);

  const positionAnimation = useMemo(() => new Animated.Value(height), []);
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
        toValue: height,
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
          height: height,
          width: "100%",
          opacity: opacityAnimation,
        }}
      >
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            padding: 32,
            display: "flex",
            zIndex: 100,
          }}
        >
          <Image
            source={icon}
            style={{
              height: props.padding ? "60%" : "80%",
              aspectRatio: 1,
            }}
          />
        </View>
        <View
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: colors.secondary,
          }}
        ></View>
      </Animated.View>
    </Animated.View>
  );
}
