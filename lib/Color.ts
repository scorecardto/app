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
    },
    dark: {
      preview: "#FF505A",
    },
  },
  orange: {
    default: {
      preview: "#FF9950",
    },
    dark: {
      preview: "#FF9950",
    },
  },
  yellow: {
    default: {
      preview: "#FFD465",
    },
    dark: {
      preview: "#FFD465",
    },
  },
  green: {
    default: {
      preview: "#2EF093",
    },
    dark: {
      preview: "#2EF093",
    },
  },
  blue: {
    default: {
      preview: "#4A93FF",
    },
    dark: {
      preview: "#4A93FF",
    },
  },
  purple: {
    default: {
      preview: "#BA49FF",
    },
    dark: {
      preview: "#BA49FF",
    },
  },
  pink: {
    default: {
      preview: "#FF5FDC",
    },
    dark: {
      preview: "#FF5FDC",
    },
  },
};

const defaultAccents = AccentsMatrix.red;

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
    secondaryNeutral: "#DDD",
    card: "#1E213B",
  },
};

const color = {
  LightTheme: MyLightTheme,
  DarkTheme: MyDarkTheme,
  AccentsMatrix,
  defaultAccents,
};
export default color;
export type { Theme };
