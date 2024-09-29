import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function SmallGradebookSheetTile(props: {
  children: React.ReactNode;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: "100%",
        height: 56,
        borderRadius: 8,
        backgroundColor: colors.backgroundNeutral,
        flexShrink: 1,
        flexGrow: 0,
        marginVertical: 8,
        paddingVertical: 12,
        paddingHorizontal: 18,
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <>
        {props.onPress ? (
          <TouchableWithoutFeedback onPress={props.onPress}>
            <View
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
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
