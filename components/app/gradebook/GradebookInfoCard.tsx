import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import useColors from "../../core/theme/useColors";
import MediumText from "../../text/MediumText";
import SmallText from "../../text/SmallText";
import useAccents from "../../core/theme/useAccents";

export default function GradebookInfoCard(props: {
  text: string;
  header: string;
  buttonText: string;
  onPress: () => void;
}) {
  const colors = useColors();
  const accents = useAccents();
  const styles = StyleSheet.create({
    wrapper: {
      //   paddingHorizontal: 24,
      paddingVertical: 12,
      width: "100%",
      maxHeight: "100%",
    },
    content: {
      backgroundColor: colors.card,
      borderRadius: 12,
      width: "100%",
    },
    header: {
      paddingVertical: 18,
      paddingHorizontal: 24,
      flexDirection: "row",
      justifyContent: "space-between",

      alignItems: "flex-start",
    },
    headerText: {
      fontSize: 16,
      color: colors.primary,
      marginBottom: 8,
    },
    buttonText: {
      fontSize: 16,
      color: accents.primary,
      width: "100%",
    },
    buttonWrapper: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 12,
      alignSelf: "center",
      backgroundColor: accents.secondary,
      width: "100%",
    },
    left: {
      overflow: "hidden",
      flexShrink: 1,
      flexGrow: 0,
    },
    right: {
      flexGrow: 1,
    },
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.left}>
            <MediumText
              numberOfLines={2}
              ellipsizeMode={"tail"}
              style={styles.headerText}
            >
              {props.header}
            </MediumText>
            <SmallText style={{ color: colors.text }}>{props.text}</SmallText>
          </View>
          <View style={styles.right}>
            <TouchableOpacity
              onPress={() => {
                props.onPress();
              }}
              style={{
                alignSelf: "flex-end",
              }}
            >
              <View style={styles.buttonWrapper}>
                <MediumText style={styles.buttonText}>
                  {props.buttonText}
                </MediumText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
