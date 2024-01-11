import React, {Dispatch, SetStateAction} from "react";
import {GradebookNotification, GradebookRecord} from "scorecard-types";

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
  confirmPhoneNumberCallback: async () => {},
  setConfirmPhoneNumberCallback: () => {},
  notifications: [],
  setNotifications: () => {},
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
  confirmPhoneNumberCallback: (code: string) => Promise<any>;
  setConfirmPhoneNumberCallback: React.SetStateAction<any>;
  notifications: GradebookNotification[];
  setNotifications: Dispatch<SetStateAction<GradebookNotification[]>>;
}
