import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import MaterialIcon from "@expo/vector-icons/MaterialCommunityIcons";
import CardEntry from "./CardEntry";
export default function LoginInputCard(props: {
  onPressDistrict: () => void;
  onPressUsername: () => void;
  onPressPassword: () => void;
  district: string;
  username: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.backgroundNeutral,
        borderRadius: 4,
        marginBottom: 10,
        borderColor: colors.borderNeutral,
        borderWidth: 1,
        borderBottomWidth: 2,
      }}
    >
      <CardEntry
        label={props.district}
        primary={true}
        onPress={props.onPressDistrict}
      />
      <CardEntry
        label={props.username}
        primary={true}
        onPress={props.onPressUsername}
      />
      <CardEntry
        label="Password not visible"
        primary={false}
        onPress={props.onPressPassword}
      />
    </View>
  );
}
