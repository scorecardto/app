import { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import MediumText from "../../text/MediumText";
import SmallText from "../../text/SmallText";
import color from "../../../lib/Color";
import MaterialIcon from "@expo/vector-icons/MaterialCommunityIcons";
import BottomSheetContext from "../../util/BottomSheet/BottomSheetContext";
import MoreFeaturesSheet from "../vip/MoreFeaturesSheet";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import useColors from "../../core/theme/useColors";
import useIsDarkMode from "../../core/theme/useIsDarkMode";
import LinearGradient from "react-native-linear-gradient";
import colorLib from "color";
import FeatureExplanationSheet from "../vip/FeatureExplanationSheet";
export default function InviteOthersCard(props: { show: boolean }) {
  const colors = useColors();
  const dark = useIsDarkMode();

  const invitedNumbers = useSelector(
    (s: RootState) => s.invitedNumbers.numbers
  );

  const openInviteSheetDate = useSelector(
    (s: RootState) => s.invitedNumbers.openInviteSheetDate
  );

  const [rightText, setRightText] = useState("tap me");

  useEffect(() => {
    if (openInviteSheetDate) {
      const intervalId = setInterval(() => {
        const now = new Date();
        const secsSinceOpen = Math.floor(
          (now.getTime() - openInviteSheetDate) / 1000
        );

        if (secsSinceOpen > 90) {
          setRightText("coming later");
        } else {
          setRightText(`expires in ${90 - secsSinceOpen}`);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    } else {
      setRightText("tap me");
    }
  }, [openInviteSheetDate]);

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

  const sheets = useContext(BottomSheetContext);

  const leftText = invitedNumbers === null ? "Customize" : "More Features";

  if (!props.show) return null;

  return (
    <TouchableOpacity
      onPress={() => {
        sheets?.addSheet((p) => {
          return <MoreFeaturesSheet close={p.close} />;
        });
      }}
    >
      <LinearGradient
        colors={[
          colors.card,
          colorLib(
            color.AccentsMatrix[accentLabel][dark ? "dark" : "default"]
              .gradientCenter
          )
            .mix(colorLib(colors.card), 0.7)
            .hex(),
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.wrapper,
          {
            opacity: 1,
          },
        ]}
      >
        <View style={styles.left}>
          <View style={styles.badge}>
            <MaterialIcon name="star" size={24} color={"white"} />
          </View>
          <MediumText
            numberOfLines={1}
            ellipsizeMode={"tail"}
            style={styles.header}
          >
            {leftText}
          </MediumText>
        </View>
        <SmallText style={styles.grade}>{rightText}</SmallText>
      </LinearGradient>
    </TouchableOpacity>
  );
}
