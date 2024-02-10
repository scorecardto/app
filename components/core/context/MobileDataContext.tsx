import React, { Dispatch, SetStateAction } from "react";

export const MobileDataContext = React.createContext<MobileData>({
  confirmPhoneNumberCallback: async () => {},
  setConfirmPhoneNumberCallback: () => {},
});

export interface MobileData {
  confirmPhoneNumberCallback: (code: string) => Promise<any>;
  setConfirmPhoneNumberCallback: React.SetStateAction<any>;
}
