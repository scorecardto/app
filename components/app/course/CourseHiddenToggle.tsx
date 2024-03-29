import { View } from "react-native";
import SmallText from "../../text/SmallText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import useColors from "../../core/theme/useColors";
export default function CourseHiddenToggle(props: {
  value?: boolean;
  onChange: (hidden: boolean) => void;
}) {
  const colors = useColors();
  return (
    <View
      style={{
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <SmallText
        style={{ fontSize: 16, marginBottom: 8, color: colors.primary }}
      >
        Visibility
      </SmallText>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {[true, false].map((val, index) => (
          <TouchableOpacity
            onPress={() => {
              props.onChange(val);
            }}
            key={index}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 5,
                marginRight: 8,
                borderColor: "rgba(0,0,0,0.2)",
                borderWidth: 1,
                borderBottomWidth: 2,
                marginBottom: 8,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: val === props.value ? "#38405A" : "#F2F2F2",
              }}
            >
              {
                <MaterialCommunityIcons
                  name={val ? "eye-off" : "eye"}
                  size={20}
                  color={val === props.value ? "#FFFFFF" : "#C0C0C0"}
                  style={{
                    width: 20,
                    height: 20,
                    textAlign: "center",
                    textAlignVertical: "center",
                    alignSelf: "center",
                    lineHeight: 20,
                  }}
                />
              }
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
