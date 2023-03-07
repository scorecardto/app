import React from "react";

export const MobileDataContext = React.createContext<MobileDataProvider>({
  district: "",
  setDistrict: () => {},
  username: "",
  setUsername: () => {},
  password: "",
  setPassword: () => {},
  sessionId: "",
  setSessionId: () => {},
  referer: "",
  setReferer: () => {},
});

export interface MobileDataProvider {
  district: string;
  setDistrict: (district: string) => void;
  username: string;
  setUsername: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  sessionId: string;
  setSessionId: (sessionId: string) => void;
  referer: string;
  setReferer: (referer: string) => void;
}
