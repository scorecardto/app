import { View, Text } from "react-native";
import React from "react";

export default function MediumText(props) {
    props.style = {
        fontSize: 16,
        fontFamily: "DMSans_500Medium",
        ...props.style,
    };
    const children = props.children;
    props.children = undefined;
  return (
    <Text
        {...props}
    >
      {children}
    </Text>
  );
}
