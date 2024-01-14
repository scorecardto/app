import { useContext, useEffect, useRef, useState } from "react";
import BottomSheetContext from "./BottomSheetContext";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import BottomSheetBase, { BottomSheetView } from "@gorhom/bottom-sheet";
import BottomSheetBackdrop from "./BottomSheetBackdrop";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";

export default function BottomSheetDisplay(props: {}) {
  const sheets = useContext(BottomSheetContext);

  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const [customOnClose, setCustomOnClose] = useState<(() => void) | undefined>(
    undefined
  );

  function onClose() {
    customOnClose?.();

    setCustomOnClose(undefined);

    if (sheets?.sheets && sheets?.sheets?.length > 0 && sheets.next()) {
      bottomSheetRef?.current?.expand();
    }
  }

  const [currentSheet, setCurrentSheet] = useState<React.ReactNode | undefined>(
    undefined
  );

  useEffect(() => {
    if (sheets?.sheets && sheets.sheets.length > 0) {
      bottomSheetRef?.current?.expand();

      setCurrentSheet(
        sheets.sheets[0]({
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
  }, [sheets?.sheets]);

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          bottomSheetRef?.current?.close();
        }}
      >
        {currentSheet != null ? (
          <View
            style={{
              height: "100%",
              width: "100%",
              top: 0,
              left: 0,
              position: "absolute",
            }}
          />
        ) : (
          <></>
        )}
      </TouchableWithoutFeedback>

      <BottomSheetBase
        keyboardBlurBehavior="restore"
        ref={bottomSheetRef}
        enableDynamicSizing={true}
        // enablePanDownToClose={true}
        containerStyle={{
          zIndex: 100,
        }}
        backgroundStyle={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        keyboardBehavior="interactive"
        onClose={onClose}
        backdropComponent={BottomSheetBackdrop}
      >
        {currentSheet}
      </BottomSheetBase>
    </>
  );
}
