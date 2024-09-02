import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import Color from "color";
import SmallText from "../../text/SmallText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import useColors from "../../core/theme/useColors";
import useIsDarkMode from "../../core/theme/useIsDarkMode";
import MediumText from "../../text/MediumText";

export default function ClubColorChanger(props: {
  initialValue?: string;
  onChange: (accentLabel: string) => void;
}) {
  const colors = useColors();
  const isDarkMode = useIsDarkMode();

  const [value, setValue] = useState(props.initialValue);

  useEffect(() => {
    if (value) {
      props.onChange(value);
    }
  }, [value]);

  const colorOptions = [
    "#4A93FF",
    "#892436",
    "#B63434",
    "#FF426F",
    "#FF5454",
    "#FF441B",
    "#FF9950",
    "#FF9E68",
    "#F8B60B",
    "#FBFF33",
    "#B4F14F",
    "#77ec2e",
    "#14A155",
    "#1CE082",
    "#3ce2c4",
    "#5877e7",
    "#3950C4",
    "#6639C4",
    "#9E3F61",
    "#BA49FF",
    "#ff49d5",
    "#FFBCEC",
    "#CB7272",
    "#292647",
    "#6F6F6F",
    "#ACACAC",
    "#e4e4e4",
  ];
  return (
    <View style={{}}>
      <MediumText
        style={{ marginTop: 10, marginBottom: 12, color: colors.primary }}
      >
        Accent Color
      </MediumText>
      <View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {colorOptions.map((c, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setValue(c);
                }}
                key={index}
              >
                <View
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    marginRight: 6,
                    borderColor: "rgba(0,0,0,0.2)",
                    borderWidth: 1,
                    marginBottom: 6,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: c,
                  }}
                >
                  {(c === value || (index === 0 && !value)) && (
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
          })}
        </View>
      </View>
    </View>
  );
}
