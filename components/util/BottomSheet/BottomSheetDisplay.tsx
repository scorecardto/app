import { useContext, useEffect, useRef, useState } from "react";
import BottomSheetContext from "./BottomSheetContext";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import BottomSheetBase from "@gorhom/bottom-sheet";
import BottomSheetBackdrop from "./BottomSheetBackdrop";
import { TouchableWithoutFeedback, View } from "react-native";

export default function BottomSheetDisplay(props: {}) {
  const sheets = useContext(BottomSheetContext);

  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  function onClose() {
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
              zIndex: 95,
            }}
          />
        ) : (
          <></>
        )}
      </TouchableWithoutFeedback>
      <BottomSheetBase
        ref={bottomSheetRef}
        snapPoints={["35%"]}
        enablePanDownToClose={true}
        containerStyle={{
          zIndex: 100,
        }}
        backgroundStyle={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        onClose={onClose}
        index={-1}
        backdropComponent={BottomSheetBackdrop}
      >
        {currentSheet}
      </BottomSheetBase>
    </>
  );
}
