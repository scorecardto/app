import { View, TouchableOpacity, Text } from "react-native";
import useColors from "../../core/theme/useColors";
import MediumText from "../../text/MediumText";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
function Button(props: {
  name: string;
  icon: string;
  onPress(): void;
  active?: boolean;
}) {
  const colors = useColors();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: props.active ? colors.button : colors.secondary,
        borderRadius: 8,
        margin: 4,
      }}
    >
      <TouchableOpacity onPress={props.onPress}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            paddingVertical: 8,
          }}
        >
          <MaterialIcons
            // @ts-ignore
            name={props.icon}
            size={20}
            style={{
              color: props.active ? "#FFFFFF" : colors.button,
            }}
          />
          <Text
            style={{
              color: props.active ? "#FFFFFF" : colors.button,
              fontSize: 12,
              marginTop: 2,
            }}
          >
            {props.name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
export default function ClubAdminToolbar(props: {
  tab: string;
  setTab(c: string): void;
}) {
  const colors = useColors();
  const navigation = useNavigation();

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          marginTop: 8,
          marginBottom: 12,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Button
          onPress={() => {
            props.setTab("home");
          }}
          name="Home"
          icon="home"
          active={props.tab === "home"}
        ></Button>
        <Button
          onPress={() => {
            props.setTab("edit");
          }}
          name="Edit"
          icon="format-paint"
          active={props.tab === "edit"}
        ></Button>
        <Button onPress={() => {}} name="Post" icon="add-box"></Button>
        <Button
          onPress={() => {
            props.setTab("members");
          }}
          name="Members"
          icon="people"
          active={props.tab === "members"}
        ></Button>
      </View>
    </>
  );
}
