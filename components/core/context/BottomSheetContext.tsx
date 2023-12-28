import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
    const remaining = sheets.length - 1;

    setSheets((s) => {
      const newState = [...s];

      newState.shift();

      return newState;
    });

    return remaining > 0;
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

  function onClose() {
    if (sheets.sheets.length > 0 && sheets.next()) {
      bottomSheetRef.current.expand();
    }
  }

  const [currentSheet, setCurrentSheet] = useState<React.ReactNode>(<></>);

  useEffect(() => {
    if (sheets.sheets.length > 0) {
      bottomSheetRef.current.expand();

      setCurrentSheet(
        sheets.sheets[0]({
          close: () => {
            bottomSheetRef.current.close();
          },
        })
      );
    }
  }, [sheets.sheets]);

  return (
    <BottomSheetBase
      ref={bottomSheetRef}
      snapPoints={["25%"]}
      enablePanDownToClose={true}
      containerStyle={{
        zIndex: 100,
      }}
      onClose={onClose}
      index={-1}
    >
      {currentSheet}
    </BottomSheetBase>
  );
}
