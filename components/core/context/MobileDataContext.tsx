import React, { Dispatch, SetStateAction } from "react";

export const MobileDataContext = React.createContext<MobileData>({
  confirmPhoneNumberCallback: async () => {},
  setConfirmPhoneNumberCallback: () => {},
  invitedNumbers: null,
  setInvitedNumbers: () => {},
});

export interface MobileData {
  confirmPhoneNumberCallback: (code: string) => Promise<any>;
  setConfirmPhoneNumberCallback: React.SetStateAction<any>;
  invitedNumbers: string[] | null;
  setInvitedNumbers: Dispatch<SetStateAction<string[] | null>>;
}
