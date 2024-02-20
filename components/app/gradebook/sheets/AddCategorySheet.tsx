import { useRef, useState } from "react";
import { View } from "react-native";
import BottomSheetHeader from "../../../util/BottomSheet/BottomSheetHeader";
import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import SmallText from "../../../text/SmallText";
import useColors from "../../../core/theme/useColors";
import SmallGradebookSheetTile from "./tiles/SmallGradebookSheetTile";
import AssignmentTileTextInput from "./tiles/AssignmentTileTextInput";
import { BottomSheetTextInputProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput";
import LargeGradebookSheetTile from "./tiles/LargeGradebookSheetTile";
import Button from "../../../input/Button";
import Toast from "react-native-toast-message";

export default function AddCategorySheet(props: {
  close(): void;
  add(weight: number, initialAverage: number): void;
  suggestWeight: number;
}) {
  const [value, setValue] = useState("100");

  const colors = useColors();

  const [weight, setWeight] = useState(`${props.suggestWeight}`);
  const weightTextInputRef = useRef<BottomSheetTextInputProps>(null);

  const [initialAverage, setInitialAverage] = useState("100");
  const initialAverageTextInputRef = useRef<BottomSheetTextInputProps>(null);
  return (
    <BottomSheetView>
      <BottomSheetHeader>Add Test Category</BottomSheetHeader>
      <View
        style={{
          padding: 12,
          marginLeft: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <LargeGradebookSheetTile
          onPress={() => {
            // textInputRef.current?.focus();
          }}
        >
          <SmallText
            style={{
              color: colors.primary,
              marginBottom: 10,
            }}
          >
            Weight
          </SmallText>
          <AssignmentTileTextInput
            value={weight}
            ref={weightTextInputRef}
            edited={false}
            onFinish={() => {}}
            placeholder={"100"}
            illegalCharacters={/[^0-9]/g}
            maxLength={3}
            setValue={setWeight}
          />
          <SmallText
            style={{
              color: colors.text,
              marginTop: 10,
            }}
          >
            {props.suggestWeight === 100 ? "Default" : "Suggested"}
          </SmallText>
        </LargeGradebookSheetTile>
        <LargeGradebookSheetTile
          onPress={() => {
            // textInputRef.current?.focus();
          }}
        >
          <SmallText
            style={{
              color: colors.primary,
              marginBottom: 10,
            }}
          >
            Starting Grade
          </SmallText>
          <AssignmentTileTextInput
            value={initialAverage}
            ref={initialAverageTextInputRef}
            edited={false}
            onFinish={() => {}}
            placeholder={"100"}
            illegalCharacters={/[^0-9]/g}
            maxLength={3}
            setValue={setInitialAverage}
          />
          <SmallText
            style={{
              color: colors.text,
              marginTop: 10,
            }}
          >
            Arbitrary
          </SmallText>
        </LargeGradebookSheetTile>
      </View>
      {/* <SmallText style={{ marginRight: 10 }}>Weight</SmallText>
        <BottomSheetTextInput
          keyboardType={"number-pad"}
          value={value}
          maxLength={3}
          style={{
            fontVariant: ["tabular-nums"],
            color: colors.primary,
            fontSize: 20,
            backgroundColor: colors.secondaryNeutral,
            paddingHorizontal: 12,
            paddingVertical: 8,
            alignSelf: "flex-start",
            borderRadius: 8,
          }}
          placeholder={"Weight"}
          onChangeText={setValue}
        />
      </View>
      <View
        style={{
          padding: 12,
          marginLeft: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <SmallText style={{ marginRight: 10 }}>Starting Grade</SmallText>
        <BottomSheetTextInput
          keyboardType={"number-pad"}
          value={value}
          maxLength={3}
          style={{
            fontVariant: ["tabular-nums"],
            color: colors.primary,
            fontSize: 20,
            backgroundColor: colors.secondaryNeutral,
            paddingHorizontal: 12,
            paddingVertical: 8,
            alignSelf: "flex-start",
            borderRadius: 8,
          }}
          placeholder={"Weight"}
          onChangeText={setValue}
        />
      </View> */}
      <View style={{ padding: 12, marginBottom: 32 }}>
        <Button
          onPress={() => {
            const weightInt = parseInt(weight);
            const initialAverageInt = parseInt(initialAverage);

            if (
              weightInt > 0 &&
              weightInt <= 100 &&
              initialAverageInt >= 0 &&
              initialAverageInt <= 100
            ) {
              props.add(weightInt, initialAverageInt);
              props.close();
            } else {
              Toast.show({
                type: "info",
                text1: "Invalid input",
                text2:
                  "Please enter a weight and initial average between 0 and 100.",
              });
            }
          }}
        >
          Add Test Category
        </Button>
      </View>
    </BottomSheetView>
  );
}
