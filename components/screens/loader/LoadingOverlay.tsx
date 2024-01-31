import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useMemo } from "react";
import { Animated } from "react-native";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from "react-native-indicators";

export default function LoadingOverlay(props: { show: boolean }) {
  const styles = StyleSheet.create({
    wrapper: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 100,
    },
  });

  const opacity = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    if (props.show) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [props.show]);

  return (
    <Animated.View
      style={[styles.wrapper, { opacity }]}
      pointerEvents={props.show ? "auto" : "none"}
    >
      {/* <View
        style={{
          width: 100,
          height: 100,
          borderRadius: 20,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      > */}
      <MaterialIndicator color="white" size={60} />
      {/* </View> */}
    </Animated.View>
  );
}
