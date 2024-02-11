import { useRef, useState } from "react";
import BottomSheetContext, { Sheet } from "./BottomSheetContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../core/state/store";
import {
  addVirtualSheetId,
  removeLatestVirtualSheetId,
} from "../../core/state/view/virtualSheetsSlice";

export default function BottomSheetProvider(props: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const sheets = useRef<Sheet[]>([]);

  const generateSheetId = (size: number) =>
    [...Array(size)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");

  const addSheet = (s: Sheet) => {
    sheets.current.push(s);
    dispatch(addVirtualSheetId(generateSheetId(8)));
  };

  const next = () => {
    const remaining = sheets.current?.length - 1;

    sheets.current.shift();

    dispatch(removeLatestVirtualSheetId({}));

    return remaining > 0;
  };

  return (
    <BottomSheetContext.Provider value={{ sheets, addSheet, next }}>
      {props.children}
    </BottomSheetContext.Provider>
  );
}
