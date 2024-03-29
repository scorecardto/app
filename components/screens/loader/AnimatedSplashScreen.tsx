import { Animated, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import Constants from "expo-constants";

export default function AnimatedSplashScreen(props: {
  children: React.ReactNode;
  image: any;
}) {
  const animation = useMemo(() => new Animated.Value(1), []);

  const [appReady, setAppReady] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (appReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [appReady]);

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
      await Promise.all([]);
    } finally {
      setAppReady(true);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {props.children}
      {!animationComplete && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: animation,
              backgroundColor:
                Constants.expoConfig?.splash?.backgroundColor || "white",
            },
          ]}
        >
          <Animated.Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: Constants.expoConfig?.splash?.resizeMode || "contain",
            }}
            source={props.image}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
}
