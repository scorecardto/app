import {useTheme} from "@react-navigation/native";
import {Text, TouchableOpacity, View} from "react-native";
import MaterialIcon from "@expo/vector-icons/MaterialCommunityIcons";

export default function CardEntry(props: {
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
