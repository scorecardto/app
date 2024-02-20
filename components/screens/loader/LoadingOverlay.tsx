import { StyleSheet } from "react-native";
import { useEffect, useMemo } from "react";
import { Animated } from "react-native";
import { MaterialIndicator } from "react-native-indicators";
import useIsDarkMode from "../../core/theme/useIsDarkMode";

export default function LoadingOverlay(props: {
  show: boolean;
  hideBackdrop?: boolean;
}) {
  const styles = StyleSheet.create({
    wrapper: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: props.hideBackdrop ? "" : "rgba(0,0,0,0.5)",
      zIndex: 100,
    },
  });

  const isDarkMode = useIsDarkMode();
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
    props.show && (
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
        <MaterialIndicator
          color={
            props.hideBackdrop
              ? isDarkMode
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.2)"
              : "white"
          }
          size={60}
        />
        {/* </View> */}
      </Animated.View>
    )
  );
}
