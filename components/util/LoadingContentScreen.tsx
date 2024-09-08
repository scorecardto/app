import { View, Text } from "react-native";
import React from "react";
import LoaderKit from "react-native-loader-kit";
import useColors from "../core/theme/useColors";

export default function LoadingContentScreen() {
  const colors = useColors();
  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <LoaderKit
        style={{ width: 32, height: 32 }}
        name={"LineScalePulseOut"} // Optional: see list of animations below
        color={colors.text} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
      />
    </View>
  );
}
