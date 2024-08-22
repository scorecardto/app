import { View, Text } from "react-native";
import React, { useState } from "react";
import MediumText from "../../text/MediumText";
import useColors from "../../core/theme/useColors";
import { TextInput } from "../../input/TextInput";

export default function ClubCustomizeView() {
  const colors = useColors();

  const [name, setName] = useState("");
  return (
    <View>
      <MediumText style={{ marginBottom: 16, color: colors.primary }}>
        Display Name
      </MediumText>
      <TextInput label="Name" setValue={setName} value={name} type="text" />
    </View>
  );
}
