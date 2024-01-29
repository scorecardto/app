import { StyleSheet, Switch, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";

export default function ToggleInput(props: {
  label: string;
  value: boolean;
  setValue: (v: boolean) => void;
  disabled?: boolean;
}) {
  const [enabled, setEnabled] = useState(props.value);

  useEffect(() => {
    props.setValue(enabled);
  }, [enabled]);

  const { colors } = useTheme();

  const styles = StyleSheet.create({
    wrapper: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.backgroundNeutral,
      borderRadius: 4,
      marginBottom: 10,
      fontSize: 16,
      borderColor: colors.borderNeutral,
      borderWidth: 1,
      borderBottomWidth: 2,
      color: colors.primary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    text: {
      color: colors.primary,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>{props.label}</Text>
      <Switch
        disabled={props.disabled}
        value={enabled}
        onValueChange={(v) => {
          if (!props.disabled) setEnabled(v);
        }}
        thumbColor={"#FFF"}
        trackColor={{
          false: colors.borderNeutral,
          true: colors.button,
        }}
        ios_backgroundColor={enabled ? colors.button : colors.borderNeutral}
        style={{
          transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
        }}
      />
    </View>
  );
}
