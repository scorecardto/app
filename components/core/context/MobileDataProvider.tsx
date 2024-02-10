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

  const [invitedNumbers, setInvitedNumbers] = useState<string[] | null>(null);

  const mobileData = useMemo<MobileData>(
    () => ({
      confirmPhoneNumberCallback,
      setConfirmPhoneNumberCallback,
      invitedNumbers,
      setInvitedNumbers,
    }),
    [
      confirmPhoneNumberCallback,
      setConfirmPhoneNumberCallback,
      invitedNumbers,
      setInvitedNumbers,
    ]
  );

  return (
    <MobileDataContext.Provider value={mobileData}>
      {props.children}
    </MobileDataContext.Provider>
  );
}
