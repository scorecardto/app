import React, { useMemo, useState } from "react";
import { MobileDataContext, MobileData } from "./MobileDataContext";
export default function MobileDataProvider(props: {
  children: React.ReactNode;
}) {
  const [confirmPhoneNumberCallback, setConfirmPhoneNumberCallback] = useState(
    () => {
      return async (code: string) => {
        console.log(
          "Attempted to confirm phone number, but no callback was set."
        );
      };
    }
  );
  const mobileData = useMemo<MobileData>(
    () => ({
      confirmPhoneNumberCallback,
      setConfirmPhoneNumberCallback,
    }),
    [confirmPhoneNumberCallback, setConfirmPhoneNumberCallback]
  );

  return (
    <MobileDataContext.Provider value={mobileData}>
      {props.children}
    </MobileDataContext.Provider>
  );
}
