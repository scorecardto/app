import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import MediumText from "../../text/MediumText";
import SmallText from "../../text/SmallText";
// import AddButton from "./AddButton";
import { Pagination } from "react-native-snap-carousel";
import AddButton from "./AddButton";

export default function GradebookCard(props: {
  title: string;
  children: React.ReactNode;
  bottom: string[];
  buttonAction: () => void;
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
    <ScrollView style={styles.wrapper}>
      <View style={styles.header}>
        <MediumText style={styles.headerText}>{props.title}</MediumText>
        {/* <Pagination
          dotsLength={props.totalCarouselLength}
          activeDotIndex={props.index + 1}
          containerStyle={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingVertical: 0,
            paddingHorizontal: 0,
          }}
          dotStyle={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: colors.primary,
          }}
          inactiveDotOpacity={0.3}
          inactiveDotScale={1}
        /> */}
      </View>
      {props.children}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          {props.bottom.map((text, idx) => {
            return (
              <React.Fragment key={idx}>
                <SmallText style={styles.footerText}>{text}</SmallText>
              </React.Fragment>
            );
          })}
        </View>
        <AddButton onPress={props.buttonAction} />
      </View>
    </ScrollView>
  );
}
