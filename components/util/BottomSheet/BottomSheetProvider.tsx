import { useState } from "react";
import BottomSheetContext, { Sheet } from "./BottomSheetContext";

export default function BottomSheetProvider(props: {
  children: React.ReactNode;
}) {
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
