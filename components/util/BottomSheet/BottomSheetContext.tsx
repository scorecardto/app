import React from "react";

type SheetParams = {
  close(): void;
  setOnClose(onClose: () => void): void;
};

type Sheet = (p: SheetParams) => React.ReactNode;

const BottomSheetContext = React.createContext<
  | {
      sheets: React.MutableRefObject<Sheet[]>;
      addSheet: (s: Sheet) => void;
      next: () => boolean;
    }
  | undefined
>(undefined);

export type { Sheet };
export default BottomSheetContext;
