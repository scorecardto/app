import {
  Dimensions, Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import MediumText from "../../text/MediumText";
import SmallText from "../../text/SmallText";
// import AddButton from "./AddButton";
import AddButton from "./AddButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TinyText from "../../text/TinyText";
import Button from "../../input/Button";

export default function GradebookCard(props: {
  title: string;
  grade?: { text: string; red: boolean };
  children: React.ReactNode;
  bottom: { [idx: string]: { text: string; red: boolean; link?: string } };
  buttonAction(): void;
  removable: boolean;
  remove(): void;
}) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.card,
      borderRadius: 12,
      flexDirection: "column",
      maxHeight: "100%",
    },
    header: {
      paddingTop: 20,
      paddingBottom: 16,
      paddingHorizontal: 24,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
    },
    headerText: {
      fontSize: 18,
      color: colors.primary,
      flex: 1,
    },
    headerGrade: {
      fontSize: 17,
      color: props.grade?.red ? "red" : colors.primary,
      marginLeft: 6,
    },
    footer: {
      flexShrink: 0,
      marginTop: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 16,
      paddingHorizontal: 24,
    },
    inner: {
      flexShrink: 1,
      overflow: "hidden",
    },
    footerLeft: {
      flexDirection: "column",
    },
    footerText: {
      marginTop: 4,
      fontSize: 14,
      color: colors.text,
    },
  });

  return (
    <View>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <MediumText
            numberOfLines={1}
            ellipsizeMode={"tail"}
            style={styles.headerText}
          >
            {props.title}
          </MediumText>
          {props.grade && (
            <MediumText style={styles.headerGrade}>
              {props.grade.text}
            </MediumText>
          )}
        </View>
        <View style={styles.inner}>{props.children}</View>
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            {Object.keys(props.bottom).map((key, idx) => {
              return (
                <React.Fragment key={idx}>
                  <View style={{ flexDirection: "row" }}>
                    <SmallText style={styles.footerText}>
                      {`${key}:`}&nbsp;
                    </SmallText>
                    <TouchableOpacity disabled={!props.bottom[key].link} onPress={() => {
                      Linking.openURL(props.bottom[key].link!);
                    }}>
                      <SmallText
                        style={{
                          ...styles.footerText,
                          color: props.bottom[key].red
                            ? "red"
                            : props.bottom[key].link ? "#6b81a8"
                            : styles.footerText.color,
                        }}
                      >
                        {props.bottom[key].text}
                      </SmallText>
                    </TouchableOpacity>
                  </View>
                </React.Fragment>
              );
            })}
          </View>
          <View style={{
            alignSelf: "flex-end"
          }}>
            <AddButton onPress={props.buttonAction} />
          </View>
        </View>
      </View>
      {props.removable && (
        <View
          style={{
            marginTop: 16,
          }}
        >
          <Button onPress={props.remove}>Remove</Button>
        </View>
        // <TouchableOpacity
        //   style={{
        //     borderColor: "red",
        //     borderStyle: "solid",
        //     borderWidth: 0.5,
        //     borderRadius: 24,
        //     display: "flex",
        //     flexDirection: "row",
        //     alignSelf: "flex-start",
        //     alignItems: "center",
        //     marginTop: 10,
        //     marginLeft: 3,
        //   }}
        //   onPress={props.remove}
        // >
        //   <TinyText
        //     style={{
        //       color: "red",
        //       paddingVertical: 8,
        //       paddingLeft: 12,
        //       paddingRight: 6,
        //     }}
        //   >
        //     Remove
        //   </TinyText>
        //   <MaterialIcons
        //     style={{
        //       color: "red",
        //       paddingRight: 8,
        //     }}
        //     name={"delete"}
        //     size={12}
        //   />
        // </TouchableOpacity>
      )}
    </View>
  );
}
