import React, { useContext, useEffect, useRef, useState } from "react";
import BottomSheetBase from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

type SheetParams = {
  close(): void;
};

export type Sheet = (p: SheetParams) => React.ReactNode;

export const BottomSheetContext = React.createContext<
  | {
      sheets: Sheet[];
      addSheet: (s: Sheet) => void;
      next: () => boolean;
    }
  | undefined
>(undefined);

export function BottomSheetProvider(props) {
  const [sheets, setSheets] = useState<Sheet[]>([]);

  const addSheet = (s: Sheet) => {
    setSheets((prevSheets) => [...prevSheets, s]);
  };

  const next = () => {
    sheets.shift();

    return sheets.length !== 0;
  };

  return (
    <BottomSheetContext.Provider value={{ sheets, addSheet, next }}>
      {props.children}
    </BottomSheetContext.Provider>
  );
}

export function BottomSheetDisplay(props) {
  const sheets = useContext(BottomSheetContext);

  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const [currentSheet, setCurrentSheet] = useState(<></>);
  useEffect(() => {
    console.log(sheets.sheets[0]);
  }, [sheets.sheets]);
  return (
    <BottomSheetBase
      ref={bottomSheetRef}
      snapPoints={["25%"]}
      enablePanDownToClose={true}
      containerStyle={{
        zIndex: 100,
      }}
    >
      {sheets.sheets[0]?.({
        close: () => {
          if (!sheets.next()) {
            bottomSheetRef.current.close();
          }
        },
      }) || <></>}
    </BottomSheetBase>
  );
}
