import { View, Text, Animated } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import MediumText from "./MediumText";
import { TouchableOpacity } from "react-native-gesture-handler";
export default function HeaderBanner(props: {
  show: boolean;
  onPress: () => void;
  label: string;
}) {
  const { colors } = useTheme();

  const opacityAnimation = React.useMemo(() => new Animated.Value(0), []);

  React.useEffect(() => {
    if (props.show) {
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [props.show]);

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 42,
        backgroundColor: colors.background,
        zIndex: 100,
        opacity: opacityAnimation,
      }}
      pointerEvents={props.show ? "auto" : "none"}
    >
      <TouchableOpacity
        onPress={props.onPress}
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MediumText>
          <Text
            style={{
              color: colors.primary,
              fontSize: 18,
            }}
          >
            {props.label}
          </Text>
        </MediumText>
      </TouchableOpacity>
    </Animated.View>
  );
}
