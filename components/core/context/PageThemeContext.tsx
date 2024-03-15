import React from "react";

export const PageThemeContext = React.createContext<PageTheme>({});

export interface PageTheme {
  dark?: PageThemeInternal;
  default?: PageThemeInternal;
}

export interface PageThemeInternal {
  background?: string;
  border?: string;
}
