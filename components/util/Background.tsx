import { View, Text } from "react-native";
import React, { ReactNode } from "react";
import useColors from "../core/theme/useColors";

export default function Background(props: {
  children: ReactNode | ReactNode[];
}) {
  const colors = useColors();
  return (
    <View
      style={{
        backgroundColor: colors.background,
      }}
    >
      {props.children}
    </View>
  );
}
