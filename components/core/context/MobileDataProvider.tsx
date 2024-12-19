import React, { useEffect, useMemo, useState } from "react";
import { MobileDataContext, MobileData } from "./MobileDataContext";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

export default function MobileDataProvider(props: {
  children: React.ReactNode;
}) {
  const [confirmPhoneNumberCallback, setConfirmPhoneNumberCallback] = useState(
    () => {
      return async (code: string) => {
        console.log("Attempted to confirm phone number, but no callback was set.");
      };
    }
  );

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const mobileData = useMemo<MobileData>(
    () => ({
      confirmPhoneNumberCallback,
      setConfirmPhoneNumberCallback,
      user,
      setUser,
    }),
    [confirmPhoneNumberCallback, setConfirmPhoneNumberCallback, user, setUser]
  );

  return (
    <MobileDataContext.Provider value={mobileData}>
      {props.children}
    </MobileDataContext.Provider>
  );
}
