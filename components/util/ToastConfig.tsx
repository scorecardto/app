import Toast, { BaseToast, ToastConfig } from "react-native-toast-message";
import { useTheme } from "@react-navigation/native";
import { View } from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { useContext } from "react";

function ToastConfigComponent() {
  const { colors } = useTheme();
  const insets = useContext(SafeAreaInsetsContext);
  const toastConfig: ToastConfig = {
    info: (props) => (
      <View
        style={{
          marginHorizontal: 12,
          marginTop: 0,
          top: 0,
        }}
      >
        <BaseToast
          {...props}
          contentContainerStyle={{
            marginTop: 0,
            top: 0,
          }}
          style={{
            backgroundColor: "#27272C" + "FF",
            borderRadius: 8,
            borderLeftWidth: 0,
            paddingVertical: 20,
            margin: 0,
            marginTop: 0,
            height: "100%",
            width: "100%",
            top: 0,
          }}
          text1NumberOfLines={1}
          text2NumberOfLines={3}
          text1Style={{
            color: "#FFFFFF",
            fontWeight: "bold",
            fontFamily: "DMSans_700Bold",
            fontSize: 16,
            marginBottom: 8,
          }}
          text2Style={{
            color: colors.text,
            fontFamily: "DMSans_400Regular",
            fontSize: 16,
            lineHeight: 24,
          }}
        />
      </View>
    ),
  };

  return <Toast config={toastConfig} topOffset={(insets?.top ?? 0) + 4} />;
}
export default ToastConfigComponent;
