import { useState } from "react";
import { Animated, Dimensions, TouchableOpacity, View } from "react-native";

export default function TabBarItem({
  state,
  descriptors,
  navigation,
  position,
  route,
  index,
}) {
  const inputRange = state.routes.map((_, i) => i);

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

  const itemWidth = Dimensions.get("window").width / 3;

  const [textWidth, setTextWidth] = useState(0);

  const opacity = position.interpolate({
    inputRange,
    outputRange: inputRange.map((_, i) => (i === index ? 1 : 0.5)),
  });
  const translateX = position.interpolate({
    inputRange,
    outputRange: inputRange.map((_, i) => {
      if (i > index) {
        return -1 * itemWidth + textWidth + 20;
      } else if (i < index) {
        return -20;
      } else {
        return textWidth / 2 - itemWidth / 2;
      }
    }),
  });

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        width: itemWidth,
        // transform: [
        //   {
        //     translateX: itemWidth / 2,
        //   },
        // ],
      }}
      key={index}
    >
      <View
        style={{
          width: "100%",
        }}
      >
        <Animated.Text
          onLayout={(l) => {
            setTextWidth(l.nativeEvent.layout.width);
          }}
          style={{
            alignSelf: "flex-end",
            fontWeight: "600",
            fontSize: 18,
            color: "white",
            transform: [
              {
                translateX,
              },
            ],
            opacity,
          }}
        >
          {label}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
}
