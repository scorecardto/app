import { Text } from "react-native";
import React, { useState } from "react";
import AssignmentEdits from "../../../../../lib/types/AssignmentEdits";
import { useTheme } from "@react-navigation/native";
import SmallText from "../../../../text/SmallText";
import SmallGradebookSheetTile from "./SmallGradebookSheetTile";
import AssignmentTileTextInputFrame from "./AssignmentTileTextInputFrame";
import { getAnalytics } from "@react-native-firebase/analytics";

export default function AssignmentDroppedTile(props: {
  dropped: boolean;
  originalDropped: boolean;
  edit(e: AssignmentEdits): boolean;
}) {
  const [testingValue, setTestingValue] = useState(props.dropped);

  const { colors } = useTheme();

  return (
    <SmallGradebookSheetTile
      onPress={() => {
        getAnalytics().logEvent("use_grade_testing", {
          type: "dropped",
        });

        props.edit({
          dropped: !testingValue,
        });

        setTestingValue(!testingValue);
      }}
    >
      <SmallText
        style={{
          color: colors.primary,
        }}
      >
        Dropped
      </SmallText>
      <AssignmentTileTextInputFrame>
        <Text
          style={{
            color:
              testingValue !== props.originalDropped ? "red" : colors.primary,
            marginVertical: -2,
          }}
        >
          {testingValue ? "yes" : "no"}
        </Text>
      </AssignmentTileTextInputFrame>
    </SmallGradebookSheetTile>
  );
}
