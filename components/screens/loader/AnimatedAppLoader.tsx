import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Asset } from "expo-asset";
import AnimatedSplashScreen from "./AnimatedSplashScreen";

export default function AnimatedAppLoader(props: {
  children: React.ReactNode;
  image: any;
}) {
  const [isSplashReady, setSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await Asset.fromModule(props.image).downloadAsync();
      setSplashReady(true);
    }

    prepare();
  }, [props.image]);

  if (!isSplashReady) {
    return null;
  }

  return (
    <AnimatedSplashScreen image={props.image}>
      {props.children}
    </AnimatedSplashScreen>
  );
}
