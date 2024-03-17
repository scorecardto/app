import { useMemo } from "react";
import { Animated, Dimensions, TouchableOpacity, View } from "react-native";
import TabBarItem from "./TabBarItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MyTabBar({ state, descriptors, navigation, position }) {
  const itemWidth = Dimensions.get("window").width / 3;
  const inputRange = state.routes.map((_, i) => i);

  const translateAllContent = position.interpolate({
    inputRange,
    outputRange: inputRange.map((_, i) => (1 - i) * itemWidth),
  });

  const topInset = useSafeAreaInsets().top;

  const color = position.interpolate({
    inputRange,
    outputRange: state.routes.map((r) => r.params.color || "black"),
  });

  return (
    <Animated.View
      style={{
        backgroundColor: color,
        paddingTop: topInset,
        position: "relative",
      }}
    >
      <Animated.View
        style={{
          flexDirection: "row",
          paddingBottom: 8,
          transform: [
            {
              translateX: translateAllContent,
            },
          ],
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          // const translateX = position.interpolate({
          //   inputRange,
          //   outputRange: inputRange.map((i) => 0),
          // });

          return (
            <TabBarItem
              descriptors={descriptors}
              index={index}
              navigation={navigation}
              position={position}
              route={route}
              state={state}
              key={index}
            />
          );
        })}
      </Animated.View>
    </Animated.View>
  );
}
