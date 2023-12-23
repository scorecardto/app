import NativeTheme, { DefaultTheme, DarkTheme } from "@react-navigation/native";

interface Theme extends NativeTheme.Theme {
  colors: {
    primary: string;
    background: string;
    backgroundNeutral: string;
    borderNeutral: string;
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
    backgroundNeutral: "#f6f6f6",
    borderNeutral: "#e8e8e8",
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
    borderNeutral: "#e8e8e8",
    card: "#1E213B",
  },
};

const color = { LightTheme: MyLightTheme, DarkTheme: MyDarkTheme };
export default color;
export type { Theme };
