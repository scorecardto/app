import { View, TouchableOpacity } from "react-native";
import useColors from "../../core/theme/useColors";
import MediumText from "../../text/MediumText";
import { useNavigation } from "@react-navigation/native";

export default function ClubsToolbar() {
  const colors = useColors();
  const navigation = useNavigation();

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginHorizontal: 12,
          marginTop: 8,
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            const screenName = "manageClubs";
            // @ts-ignore
            navigation.navigate(screenName);
          }}
        >
          <View
            style={{
              backgroundColor: colors.button,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 99,
            }}
          >
            <MediumText
              style={{
                color: "#FFFFFF",
                fontSize: 16,
              }}
            >
              Manage
            </MediumText>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}
