import React, { useContext } from "react";
import {
  Appearance,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Course, DataContext } from "scorecard-types";
import MediumText from "../../text/MediumText";
import SmallText from "../../text/SmallText";
import { useTheme } from "@react-navigation/native";
import color from "../../../lib/Color";
import MaterialIcon from "@expo/vector-icons/MaterialCommunityIcons";
export default function InviteOthersCard(props: {
  invitesLeft: number;
  onClick: () => void;
  onHold: () => void;
}) {
  const { colors, dark } = useTheme();

  const { courseSettings } = useContext(DataContext);

  const accentLabel = "yellow";

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 10,
      marginHorizontal: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      textAlignVertical: "center",
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      overflow: "hidden",
    },
    badge: {
      width: 56,
      height: 56,
      backgroundColor:
        color.AccentsMatrix[accentLabel][dark ? "dark" : "default"].primary,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      paddingLeft: 24,
      color: colors.primary,
      flex: 1,
    },
    grade: {
      marginRight: 24,
      marginLeft: 6,
      fontSize: 16,
      color: colors.text,
    },
  });
  return (
    <TouchableOpacity onPress={props.onClick} onLongPress={props.onHold}>
      <View style={styles.wrapper}>
        <View style={styles.left}>
          <View style={styles.badge}>
            <MaterialIcon name="star" size={24} color={"white"} />
          </View>
          <MediumText
            numberOfLines={1}
            ellipsizeMode={"tail"}
            style={styles.header}
          >
            More Features
          </MediumText>
        </View>
        <SmallText style={styles.grade}>
          {props.invitesLeft} invites left
        </SmallText>
      </View>
    </TouchableOpacity>
  );
}
