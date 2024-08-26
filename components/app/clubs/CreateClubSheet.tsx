import { View } from "react-native";
import { Ref, forwardRef, useState } from "react";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../core/state/store";
import useColors from "../../core/theme/useColors";
import ClubNameTextInput from "./ClubNameTextInput";
import Spacer from "../../util/Spacer";
import Button from "../../input/Button";

const CreateClubSheet = forwardRef(
  (
    props: {
      onFinish(): void;
    },
    ref: Ref<ActionSheetRef>
  ) => {
    const colors = useColors();

    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState("");
    const [tag, setTag] = useState("");
    return (
      <ActionSheet
        ref={ref}
        containerStyle={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 8,
          paddingBottom: 16,
          backgroundColor: colors.card,
        }}
      >
        <BottomSheetHeader>Create Club</BottomSheetHeader>
        <View
          style={{
            padding: 16,
          }}
        >
          <ClubNameTextInput
            value={name}
            setValue={setName}
            label="Name"
            description={``}
          />

          <ClubNameTextInput
            value={tag}
            setValue={setTag}
            label="Username"
            description={`Must be unique, e.g. "DOGS" or "MODELUN"`}
          />
          <Spacer h={40}></Spacer>
          <Button onPress={() => {}}>Create</Button>
        </View>
      </ActionSheet>
    );
  }
);

export default CreateClubSheet;
