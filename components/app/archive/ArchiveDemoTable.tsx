import { View, Text } from "react-native";
import StatusText from "../../text/StatusText";
import useColors from "../../core/theme/useColors";
export default function ArchiveDemoTable(props: {
  gradeCategoryNames: string[];
}) {
  const colors = useColors();
  const rows = Math.ceil(props.gradeCategoryNames.length / 4);
  return (
    <View
      style={{
        marginHorizontal: 20,
        marginBottom: 0,
        marginTop: 14,
      }}
    >
      <StatusText
        style={{
          color: colors.text,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Grading Period Key:
      </StatusText>
      {new Array(rows).fill(0).map((_, row) => {
        return (
          <View
            key={row}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              borderTopColor: colors.borderNeutral,
              borderTopWidth: row !== 0 ? 1 : 0,
              backgroundColor: colors.borderNeutral,
            }}
          >
            {new Array(4).fill(0).map((_, col) => {
              const idx = row * 4 + col;
              return (
                <View
                  key={idx}
                  style={{
                    width: "25%",
                    marginRight: idx % 4 !== 3 ? 1 : 0,
                    backgroundColor: colors.background,
                    paddingVertical: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      textAlign: "center",
                      textAlignVertical: "center",
                      color: colors.text,
                      fontWeight: "700",
                    }}
                  >
                    {props.gradeCategoryNames[idx]}
                  </Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}
