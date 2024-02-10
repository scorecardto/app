import { useTheme } from "@react-navigation/native";

function useIsDarkMode(): boolean {
  const { dark } = useTheme();
  return dark;
}

export default useIsDarkMode;
