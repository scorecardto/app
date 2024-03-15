import React from "react";
import { PageTheme, PageThemeContext } from "./PageThemeContext";

export default function PageThemeProvider(props: {
  children: React.ReactNode;
  theme: PageTheme;
}) {
  return (
    <PageThemeContext.Provider value={props.theme}>
      {props.children}
    </PageThemeContext.Provider>
  );
}
