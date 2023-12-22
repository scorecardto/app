import { DarkTheme, DefaultTheme } from "@react-navigation/native";

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#000",
    text: "#A0A0A0",
    background: "#F6FAFD",
    card: "#FFF",
  },
};

const MyDarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#000",
    text: "#A0A0A0",
    background: "#151727",
    card: "#1E213B",
  },
};

const color = { LightTheme: MyLightTheme, DarkTheme: MyDarkTheme };
export default color;
