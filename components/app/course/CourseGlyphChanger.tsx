import { Text, View } from "react-native";
import SmallText from "../../text/SmallText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import useColors from "../../core/theme/useColors";
import { useEffect, useState } from "react";
import CourseGlyphCategoryChip from "./CourseGlyphCategoryChip";
export default function CourseGlyphChanger(props: {
  value?: string;
  onChange: (accentLabel: string | undefined) => void;
}) {
  const ICONS = [
    "skull",
    "emoticon-devil",
    "nuke",
    "fire",
    "food-apple",
    "function-variant",
    "leaf",
    "virus",
    "atom",
    "calculator-variant",
    "console",
    "beaker",
    "code-braces",
    "shape",
    "earth",
    "flag",
    "translate",
    "pencil",
    "book-open-blank-variant",
    "brush",
    "music",
    "basketball",
    "tennis",
    "football",
    "arm-flex",
    "drama-masks",
  ];

  // const a=  <MaterialCommunityIcons name=""/>;
  const colors = useColors();

  const [value, setValue] = useState<string | undefined>(props.value);

  useEffect(() => {
    props.onChange(value);
  }, [value]);

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
        Icon
      </SmallText>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {ICONS.map((icon, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setValue(icon);
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
                  backgroundColor:
                    icon === value ? colors.button : colors.background,
                }}
              >
                {
                  <MaterialCommunityIcons
                    // @ts-ignore
                    name={icon}
                    size={20}
                    color={icon === value ? "#FFFFFF" : colors.text}
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
          );
        })}
        <TouchableOpacity
          onPress={() => {
            setValue("");
          }}
        >
          <View
            style={{
              height: 40,
              width: 70,
              borderRadius: 5,
              marginRight: 8,
              borderColor: "rgba(0,0,0,0.2)",
              borderWidth: 1,
              borderBottomWidth: 2,
              marginBottom: 8,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: !value ? colors.button : colors.background,
            }}
          >
            <Text
              style={{
                color: !value ? "#FFFFFF" : colors.text,
              }}
            >
              None
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
