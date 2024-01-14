import { useContext, useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";

function useFooterHeight() {
  const insets = useContext(SafeAreaInsetsContext);

  return 68 + (insets?.bottom ?? 0) / 2;
}
export default useFooterHeight;
