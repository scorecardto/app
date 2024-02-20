import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

function useKeyboardVisible() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const android = Platform.OS === "android";

    const keyboardWillShowListener = Keyboard.addListener(
      android ? "keyboardDidShow" : "keyboardWillShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      android ? "keyboardDidHide" : "keyboardWillHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardWillHideListener.remove();
      keyboardWillShowListener.remove();
    };
  }, []);
  return isKeyboardVisible;
}
export default useKeyboardVisible;
