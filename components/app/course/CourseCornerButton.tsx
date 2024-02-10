import { View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import useColors from "../../core/theme/useColors";

export default function CourseCornerButton(props: {
  side: "left" | "right";
  icon: string;
  iconSize?: number;
  iconPadding?: number;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View>
        <View
          style={[
            {
              paddingVertical: 16,
            },
            props.side === "left"
              ? {
                  paddingRight: 16,
                  paddingLeft: props.iconPadding || 8,
                  borderTopRightRadius: 32,
                  borderBottomRightRadius: 32,
                }
              : {
                  paddingLeft: 16,
                  paddingRight: props.iconPadding || 8,
                  borderTopLeftRadius: 32,
                  borderBottomLeftRadius: 32,
                },
          ]}
        >
          <MaterialIcons
            // @ts-ignore
            name={props.icon}
            size={props.iconSize || 36}
            color={colors.text}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
