import { View } from "react-native";
import { useEffect, useState } from "react";
import Color from "../../../lib/Color";
import SmallText from "../../text/SmallText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import useColors from "../../core/theme/useColors";
import useIsDarkMode from "../../core/theme/useIsDarkMode";
export default function CourseColorChanger(props: {
  initialValue: string;
  onChange: (accentLabel: string) => void;
}) {
  const colors = useColors();
  const isDarkMode = useIsDarkMode();

  const [value, setValue] = useState(props.initialValue);

  useEffect(() => {
    props.onChange(value);
  }, [value]);

  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <SmallText
        style={{ fontSize: 16, marginBottom: 8, color: colors.primary }}
      >
        Color
      </SmallText>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {Object.entries(Color.AccentsMatrix).map(
          ([accentLabel, colors], index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setValue(accentLabel);
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
                      colors[isDarkMode ? "dark" : "default"].preview,
                  }}
                >
                  {accentLabel === value && (
                    <MaterialIcons
                      name="check"
                      size={20}
                      color={"#FFFFFF"}
                      style={{
                        width: 20,
                        height: 20,
                        textAlign: "center",
                        textAlignVertical: "center",
                        alignSelf: "center",
                        lineHeight: 20,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          }
        )}
      </View>
    </View>
  );
}
