export interface ColorThemeWithAppearance {
  light: ColorTheme;
  dark: ColorTheme;
}

export interface ColorTheme {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
}

const PACIFIC_NEUTRAL = {
  300: '#73A2D0',
  400: '#5E90BE',
  500: '#5886B0',
  600: '#4F86D9',
  700: '#7C4FB6',
  800: '#3330B2',
};

export const THEME_PACIFIC: ColorThemeWithAppearance = {
  light: {
    100: '#DBE9FF',
    200: '#3D7AD6',
    ...PACIFIC_NEUTRAL,
  },
  dark: {
    100: '#3D7AD6',
    200: '#DBE9FF',
    ...PACIFIC_NEUTRAL,
  },
};

const ROSE_NEUTRAL = {
  300: '#A03669',
  400: '#BE5E8C',
  500: '#B05883',
  600: '#D94FC3',
  700: '#CC3156',
  800: '#8B1842',
};

export const THEME_ROSE: ColorThemeWithAppearance = {
  light: {
    100: '#FCDDEC',
    200: '#e34496',
    ...ROSE_NEUTRAL,
  },
  dark: {
    100: '#e34496',
    200: '#FCDDEC',
    ...ROSE_NEUTRAL,
  },
};

const WARM_NEUTRAL = {
  100: '#FCF7DD',
  200: '#EE6417',
  300: '#E2800C',
  400: '#F89C13',
  500: '#E77A15',
  600: '#DF7D21',
  700: '#B61D1D',
  800: '#EE6417',
};

export const THEME_WARM: ColorThemeWithAppearance = {
  light: {
    ...WARM_NEUTRAL,
    100: '#FCF7DD',
    200: '#EE6417',
  },
  dark: {
    ...WARM_NEUTRAL,
    100: '#EE6417',
    200: '#FCF7DD',
  },
};
