import NativeTheme, { DefaultTheme, DarkTheme } from "@react-navigation/native";

const AccentsMatrix: {
  [x: string]: {
    default: Theme["accents"];
    dark: Theme["accents"];
  };
} = {
  rose: {
    default: {
      preview: "#FF426F",
      primary: "#d72b59",
      gradientCenter: "#ffa9ca",
      secondary: "#FFF2F6",
    },
    dark: {
      preview: "#FF426F",
      primary: "#d72b59",
      gradientCenter: "#97172c",
      secondary: "#3C1D27",
    },
  },
  red: {
    default: {
      preview: "#FF5454",
      primary: "#d7312b",
      gradientCenter: "#ffcdcd",
      secondary: "#fff2f2",
    },
    dark: {
      preview: "#FF5454",
      primary: "#d7312b",
      gradientCenter: "#971717",
      secondary: "#4b1f1f",
    },
  },
  orange: {
    default: {
      preview: "#FF9950",
      primary: "#FF7135",
      gradientCenter: "#ffccb3",
      secondary: "#FFF2EC",
    },
    dark: {
      preview: "#FF9950",
      primary: "#FF7135",
      gradientCenter: "#a34502",
      secondary: "#4C2B13",
    },
  },
  yellow: {
    default: {
      preview: "#FFD231",
      primary: "#FFA800",
      gradientCenter: "#ffdb9d",
      secondary: "#FFFAEC",
    },
    dark: {
      preview: "#FFD231",
      primary: "#FFA800",
      gradientCenter: "#6a4e06",
      secondary: "#352C12",
    },
  },
  lime: {
    default: {
      preview: "#77ec2e",
      primary: "#48b008",
      gradientCenter: "#c8feba",
      secondary: "#ddfada",
    },
    dark: {
      preview: "#77ec2e",
      primary: "#48b008",
      gradientCenter: "#186311",
      secondary: "#122c13",
    },
  },
  green: {
    default: {
      preview: "#1CE082",
      primary: "#00874F",
      gradientCenter: "#95f6cc",
      secondary: "#DAFEEB",
    },
    dark: {
      preview: "#1CE082",
      primary: "#00874F",
      gradientCenter: "#136b36",
      secondary: "#143232",
    },
  },
  teal: {
    default: {
      preview: "#3ce2c4",
      primary: "#0f9d9d",
      gradientCenter: "#a9ecee",
      secondary: "#E3F8FF",
    },
    dark: {
      preview: "#3ce2c4",
      primary: "#0f9d9d",
      gradientCenter: "#155c5a",
      secondary: "#1A3249",
    },
  },
  blue: {
    default: {
      preview: "#4A93FF",
      primary: "#2B99D7",
      gradientCenter: "#98cdf3",
      secondary: "#E3F8FF",
    },
    dark: {
      preview: "#4A93FF",
      primary: "#2B99D7",
      gradientCenter: "#045187",
      secondary: "#1A3249",
    },
  },
  indigo: {
    default: {
      preview: "#5877e7",
      primary: "#4261d0",
      gradientCenter: "#98b5f3",
      secondary: "#E3F8FF",
    },
    dark: {
      preview: "#5877e7",
      primary: "#4261d0",
      gradientCenter: "#391b9d",
      secondary: "#1A3249",
    },
  },
  purple: {
    default: {
      preview: "#BA49FF",
      primary: "#8e5acd",
      gradientCenter: "#D6C7FF",
      secondary: "#F8EEFF",
    },
    dark: {
      preview: "#BA49FF",
      primary: "#8e5acd",
      gradientCenter: "#4f1990",
      secondary: "#371A49",
    },
  },
  pink: {
    default: {
      preview: "#ff49d5",
      primary: "#de4fbd",
      gradientCenter: "#f8b3f7",
      secondary: "#ffeefc",
    },
    dark: {
      preview: "#ff49d5",
      primary: "#de4fbd",
      gradientCenter: "#901964",
      secondary: "#491a44",
    },
  },
  brown: {
    default: {
      preview: "#CB7272",
      primary: "#b35c5c",
      gradientCenter: "#daa9a9",
      secondary: "#f7efef",
    },
    dark: {
      preview: "#CB7272",
      primary: "#b35c5c",
      gradientCenter: "#532a26",
      secondary: "#322321",
    },
  },
  night: {
    default: {
      preview: "#292647",
      primary: "#292647",
      gradientCenter: "#9996a5",
      secondary: "#eaeffb",
    },
    dark: {
      preview: "#292647",
      primary: "#292647",
      gradientCenter: "#000000",
      secondary: "#616196",
    },
  },
  day: {
    default: {
      preview: "#e4e4e4",
      primary: "#a9a9a9",
      gradientCenter: "#dce6e5",
      secondary: "#efefef",
    },
    dark: {
      preview: "#e4e4e4",
      primary: "#8d8d8d",
      gradientCenter: "#555555",
      secondary: "#3d3d3d",
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
    secondary: string;
    secondaryNeutral: string;
    textInput: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    button: string;
    buttonBorder: string;
    gold: string;
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
    textInput: "#f1f1f1",
    border: "#EEF8FF",
    borderNeutral: "#e8e8e8",
    secondary: "#D5E8FA",
    secondaryNeutral: "#f4f4f4",
    card: "#FFF",
    button: "#2B74BE",
    buttonBorder: "#1585c2",
    gold: "#de9b28",
  },
};

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#FFF",
    text: "#A0A0A0",
    background: "#1a1b24",
    backgroundNeutral: "#1d1f28",
    textInput: "#282a39",
    borderNeutral: "#292d3b",
    border: "#151727",
    secondary: "#2F3E65",
    secondaryNeutral: "#272938",
    card: "#242635",
    button: "#2B74BE",
    buttonBorder: "#098fd7",
    gold: "#de9b28",
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
