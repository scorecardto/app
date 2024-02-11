import { useContext, useEffect, useRef, useState } from "react";
import BottomSheetContext from "./BottomSheetContext";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import BottomSheetBase, { BottomSheetView } from "@gorhom/bottom-sheet";
import BottomSheetBackdrop from "./BottomSheetBackdrop";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";

export default function BottomSheetDisplay(props: {}) {
  const sheets = useContext(BottomSheetContext);

  const virtualSheetIds = useSelector(
    (s: RootState) => s.virtualSheets.sheetIds
  );

  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const { colors } = useTheme();

  const [customOnClose, setCustomOnClose] = useState<(() => void) | undefined>(
    undefined
  );

  function onClose() {
    if (
      sheets?.sheets?.current &&
      sheets?.sheets?.current?.length > 0 &&
      sheets.next()
    ) {
      bottomSheetRef?.current?.expand();
    }

    customOnClose?.();

    setCustomOnClose(undefined);
  }

  const [currentSheet, setCurrentSheet] = useState<React.ReactNode | undefined>(
    undefined
  );

  useEffect(() => {
    if (sheets?.sheets && sheets.sheets.current?.length > 0) {
      bottomSheetRef?.current?.expand();

      setCurrentSheet(
        sheets.sheets.current[0]({
          close: () => {
            bottomSheetRef?.current?.close();
          },
          setOnClose: (onClose: () => void) => {
            setCustomOnClose(onClose);
          },
        })
      );
    } else {
      setCurrentSheet(undefined);
    }
  }, [virtualSheetIds]);

  return (
    <>
      <View
        style={{
          height: "100%",
          width: "100%",
          top: 0,
          left: 0,
          position: "absolute",
          flexDirection: "column",
          justifyContent: "flex-end",
          zIndex: currentSheet != null ? 999 : -1,
        }}
      >
        <>
          {currentSheet != null ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  bottomSheetRef?.current?.close();
                }}
                style={{
                  height: "100%",
                  width: "100%",
                  top: 0,
                  left: 0,
                  position: "absolute",
                  zIndex: currentSheet != null ? 9 : -1,
                }}
              >
                <></>
              </TouchableOpacity>
            </>
          ) : (
            <></>
          )}
          <BottomSheetBase
            keyboardBlurBehavior="restore"
            ref={bottomSheetRef}
            enableDynamicSizing={true}
            enableContentPanningGesture={true}
            enablePanDownToClose={true}
            handleStyle={{
              borderBottomColor: "red",
            }}
            containerStyle={{
              zIndex: 100,
            }}
            backgroundStyle={{
              backgroundColor: colors.card,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
            keyboardBehavior="extend"
            onClose={onClose}
            backdropComponent={BottomSheetBackdrop}
          >
            {currentSheet}
          </BottomSheetBase>
        </>
      </View>
    </>
  );
}
