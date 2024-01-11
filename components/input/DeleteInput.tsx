import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import MaterialIcon from "@expo/vector-icons/MaterialCommunityIcons";
export default function DeleteInput(props: {
  onPress: () => void;
  children: string;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: colors.backgroundNeutral,
          borderRadius: 4,
          marginBottom: 10,
          borderColor: colors.borderNeutral,
          borderWidth: 1,
          borderBottomWidth: 2,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MaterialIcon
          name="trash-can-outline"
          size={18}
          color={"red"}
          style={{ marginRight: 16 }}
        />
        <Text
          style={{
            fontSize: 16,
            color: "red",
          }}
        >
          {props.children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
