import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import MediumText from "../../text/MediumText";
import SmallText from "../../text/SmallText";
// import AddButton from "./AddButton";
import AddButton from "./AddButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TinyText from "../../text/TinyText";

export default function GradebookCard(props: {
  title: string;
  grade?: { text: string; red: boolean };
  children: React.ReactNode;
  bottom: { [idx: string]: { text: string; red: boolean } };
  buttonAction(): void;
  removable: boolean;
  remove(): void;
}) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.card,
      borderRadius: 12,
      maxHeight: 500,
    },
    header: {
      paddingVertical: 24,
      paddingHorizontal: 24,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerText: {
      fontSize: 20,
      color: colors.primary,
    },
    headerGrade: {
      fontSize: 17,
      color: props.grade?.red ? "red" : colors.primary,
    },
    footer: {
      marginTop: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 16,
      paddingHorizontal: 24,
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
      <ScrollView style={styles.wrapper}>
        <View style={styles.header}>
          <MediumText style={styles.headerText}>{props.title}</MediumText>
          {props.grade && (
            <MediumText style={styles.headerGrade}>
              {props.grade.text}
            </MediumText>
          )}
        </View>
        {props.children}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            {Object.keys(props.bottom).map((key, idx) => {
              return (
                <React.Fragment key={idx}>
                  <View style={{ flexDirection: "row" }}>
                    <SmallText style={styles.footerText}>
                      {`${key}:`}&nbsp;
                    </SmallText>
                    <SmallText
                      style={{
                        ...styles.footerText,
                        color: props.bottom[key].red
                          ? "red"
                          : styles.footerText.color,
                      }}
                    >
                      {props.bottom[key].text}
                    </SmallText>
                  </View>
                </React.Fragment>
              );
            })}
          </View>
          <AddButton onPress={props.buttonAction} />
        </View>
      </ScrollView>
      {props.removable && (
        <TouchableOpacity
          style={{
            borderColor: "red",
            borderStyle: "solid",
            borderWidth: 0.5,
            borderRadius: 24,
            display: "flex",
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "center",
            marginTop: 10,
            marginLeft: 3,
          }}
          onPress={props.remove}
        >
          <TinyText
            style={{
              color: "red",
              paddingVertical: 8,
              paddingLeft: 12,
              paddingRight: 6,
            }}
          >
            Remove
          </TinyText>
          <MaterialIcons
            style={{
              color: "red",
              paddingRight: 8,
            }}
            name={"delete"}
            size={12}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
