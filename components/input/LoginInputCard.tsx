import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import MaterialIcon from "@expo/vector-icons/MaterialCommunityIcons";
function CardEntry(props: {
  label: string;
  primary: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderColor: colors.borderNeutral,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: props.primary ? colors.primary : colors.text,
          }}
        >
          {props.label}
        </Text>
        <MaterialIcon name="chevron-right" size={24} color={colors.text} />
      </View>
    </TouchableOpacity>
  );
}
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
