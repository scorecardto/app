import NativeTheme, { DefaultTheme, DarkTheme } from "@react-navigation/native";

const AccentsMatrix: {
  [x: string]: {
    default: Theme["accents"];
    dark: Theme["accents"];
  };
} = {
  red: {
    default: {
      preview: "#FF505A",
      primary: "#D72B3F",
      gradientCenter: "#FFDDE3",
      secondary: "#FFF2F6",
    },
    dark: {
      preview: "#FF505A",
      primary: "#D72B3F",
      gradientCenter: "#FFDDE3",
      secondary: "#FFF2F6",
    },
  },
  orange: {
    default: {
      preview: "#FF9950",
      primary: "#FF7135",
      gradientCenter: "#FFD6C9",
      secondary: "#FFF2EC",
    },
    dark: {
      preview: "#FF9950",
      primary: "#FF7135",
      gradientCenter: "#FFD6C9",
      secondary: "#FFF2EC",
    },
  },
  yellow: {
    default: {
      preview: "#FFD465",
      primary: "#FFA800",
      gradientCenter: "#FFF3C9",
      secondary: "#FFFAEC",
    },
    dark: {
      preview: "#FFD465",
      primary: "#FFA800",
      gradientCenter: "#FFF3C9",
      secondary: "#FFFAEC",
    },
  },
  green: {
    default: {
      preview: "#1CE082",
      primary: "#00874F",
      gradientCenter: "#C7FFE7",
      secondary: "#DAFEEB",
    },
    dark: {
      preview: "#1CE082",
      primary: "#00874F",
      gradientCenter: "#C7FFE7",
      secondary: "#DAFEEB",
    },
  },
  blue: {
    default: {
      preview: "#4A93FF",
      primary: "#2B99D7",
      gradientCenter: "#D7F5FF",
      secondary: "#E3F8FF",
    },
    dark: {
      preview: "#4A93FF",
      primary: "#2B99D7",
      gradientCenter: "#D7F5FF",
      secondary: "#E3F8FF",
    },
  },
  purple: {
    default: {
      preview: "#BA49FF",
      primary: "#AD79EE",
      gradientCenter: "#D6C7FF",
      secondary: "#F8EEFF",
    },
    dark: {
      preview: "#BA49FF",
      primary: "#AD79EE",
      gradientCenter: "#D6C7FF",
      secondary: "#F8EEFF",
    },
  },
};

const defaultAccentLabel = "blue";

interface Theme extends NativeTheme.Theme {
  colors: {
    primary: string;
    background: string;
    backgroundNeutral: string;
    borderNeutral: string;
    secondaryNeutral: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
  accents: {
    preview: string;
    primary: string;
    secondary: string;
    gradientCenter: string;
  };
  dark: boolean;
  accentLabel: string;
}

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#000",
    text: "#A0A0A0",
    background: "#F6FAFD",
    backgroundNeutral: "#f6f6f6",
    border: "#EEF8FF",
    borderNeutral: "#e8e8e8",
    secondaryNeutral: "#f4f4f4",
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
    border: "#EEF8FF",
    secondaryNeutral: "#DDD",
    card: "#1E213B",
  },
};

const color = {
  LightTheme: MyLightTheme,
  DarkTheme: MyDarkTheme,
  AccentsMatrix,
  defaultAccentLabel,
};
export default color;
export type { Theme };
