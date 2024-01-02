import { useContext, useState } from "react";
import ThemeContext from "./ThemeContext";
import color, { Theme } from "../../../lib/Color";
import { useColorScheme } from "react-native";

export default function ThemeProvider(props: {
  children?: React.ReactNode;
  dark?: boolean;
  accentLabel?: string;
}) {
  const parentContext = useContext(ThemeContext);

  const appearance = useColorScheme();

  const isDark = props.dark ?? parentContext?.dark ?? appearance === "dark";

  const accentLabel =
    props.accentLabel ?? parentContext?.accentLabel ?? color.defaultAccentLabel;

  const theme: Theme = {
    dark: isDark,
    accentLabel,
    accents: color[accentLabel][isDark ? "dark" : "default"],
    colors: isDark ? color.DarkTheme.colors : color.LightTheme.colors,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  );
}
