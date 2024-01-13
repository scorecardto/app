import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import MaterialIcon from "@expo/vector-icons/MaterialCommunityIcons";
function CardEntry(props: {
  label: string;
  checked: boolean;
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
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderColor: colors.borderNeutral,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: colors.primary,
          }}
        >
          {props.label}
        </Text>
        {props.checked ? (
          <MaterialIcon name="check" size={18} color={colors.text} />
        ) : (
          <View />
        )}
      </View>
    </TouchableOpacity>
  );
}
export default function SelectInput(props: {
  options: {
    label: string;
    value: string;
  }[];
  selected: string;
  setSelected: (v: string) => void;
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
      {props.options.map((option, idx) => (
        <CardEntry
          key={idx}
          label={option.label}
          checked={option.value === props.selected}
          onPress={() => {
            props.setSelected(option.value);
          }}
        />
      ))}
    </View>
  );
}
