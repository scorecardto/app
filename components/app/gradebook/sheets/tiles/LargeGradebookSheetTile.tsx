import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function LargeGradebookSheetTile(props: {
  children: React.ReactNode;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: "100%",
        height: 128,
        borderRadius: 8,
        backgroundColor: colors.backgroundNeutral,
        flexShrink: 1,
        flexGrow: 0,
        margin: 8,
        paddingVertical: 12,
        paddingHorizontal: 18,
      }}
    >
      <>
        {props.onPress ? (
          <TouchableWithoutFeedback onPress={props.onPress}>
            <View
              style={{
                height: "100%",
              }}
            >
              {props.children}
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <>{props.children}</>
        )}
      </>
    </View>
  );
}
