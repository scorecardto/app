import { View, Animated } from "react-native";
import { useEffect, useMemo } from "react";
import { Image } from "expo-image";
import useColors from "../../core/theme/useColors";

const icon = require("../../../assets/icon.png");

export default function AccountSubpageBanner(props: {
  show: boolean;
  padding?: boolean;
}) {
  const height = 150;

  const heightAnimation = useMemo(() => new Animated.Value(height), []);
  const opacityAnimation = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    if (!props.show) {
      Animated.timing(heightAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();

      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(heightAnimation, {
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

  const colors = useColors();

  return (
    <Animated.View
      style={{
        height: 0,
        overflow: "visible",
        marginBottom: heightAnimation,
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
              height: props.padding ? 60 : 80,
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
