import NativeTheme, { DefaultTheme, DarkTheme } from "@react-navigation/native";

interface Theme extends NativeTheme.Theme {
  colors: {
    primary: string;
    background: string;
    backgroundNeutral: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
}

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#000",
    text: "#A0A0A0",
    background: "#F6FAFD",
    backgroundNeutral: "#FCFCFC",
    card: "#FFF",
  },
};

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#FFF",
    text: "#A0A0A0",
    background: "#151727",
    backgroundNeutral: "#CCC",
    card: "#1E213B",
  },
};

const color = { LightTheme: MyLightTheme, DarkTheme: MyDarkTheme };
export default color;
export type { Theme };
