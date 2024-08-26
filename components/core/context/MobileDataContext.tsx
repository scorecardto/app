import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import React, { Dispatch, SetStateAction } from "react";

export const MobileDataContext = React.createContext<MobileData>({
  confirmPhoneNumberCallback: async () => {},
  setConfirmPhoneNumberCallback: () => {},
  user: null,
  setUser: () => {},
});

export interface MobileData {
  confirmPhoneNumberCallback: (code: string) => Promise<any>;
  setConfirmPhoneNumberCallback: React.SetStateAction<any>;
  user: FirebaseAuthTypes.User | null;
  setUser: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>;
}
