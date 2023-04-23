import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AssignmentMetaTableRow(props: {
  left: string;
  right: string;
}) {
  return (
    <View>
      <View>
        <Text>{props.left}</Text>
      </View>

      <View>
        <Text>{props.right}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
