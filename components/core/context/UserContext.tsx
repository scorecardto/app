import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import React, { Dispatch, SetStateAction } from "react";

export const UserContext = React.createContext<UserData>({
  user: null,
  setUser: () => {},
});

export interface UserData {
  user: FirebaseAuthTypes.User | null;
  setUser: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>;
}
