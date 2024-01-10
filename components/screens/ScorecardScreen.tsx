import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CurrentGradesScreen from "./CurrentGradesScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";
import ArchiveScreen from "./ArchiveScreen";
import AccountScreen from "./account/AccountScreen";

const Tab = createBottomTabNavigator();

export default function ScorecardScreen() {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            height: 84,
            borderTopWidth: 0,
            elevation: 0,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.1,
          }}
        >
          {props.state.routes.map((route, index) => {
            const { options } = props.descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = props.state.index === index;

            const onPress = () => {
              const event = props.navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                props.navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              props.navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <TouchableWithoutFeedback
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
              >
                <View
                  style={{
                    paddingHorizontal: 40,
                    paddingVertical: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {options?.tabBarIcon?.({
                    focused: isFocused,
                    size: 28,
                    color: isFocused ? "#000" : "#666",
                  })}
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      )}
      initialRouteName="current"
    >
      <Tab.Screen
        name="account"
        component={AccountScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="person-circle"
              size={size}
              color={focused ? "#000" : "#666"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="current"
        component={CurrentGradesScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, size }) => (
            <Foundation
              name="home"
              size={size}
              color={focused ? "#000" : "#666"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="archive"
        component={ArchiveScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="time"
              size={size}
              color={focused ? "#000" : "#666"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
