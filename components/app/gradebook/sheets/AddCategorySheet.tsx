import React, {useState} from "react";
import {Button, View} from "react-native";
import BottomSheetHeader from "../../../util/BottomSheet/BottomSheetHeader";
import {BottomSheetTextInput} from "@gorhom/bottom-sheet";
import {useTheme} from "@react-navigation/native";
import SmallText from "../../../text/SmallText";

export default function AddCategorySheet(props: {
    close(): void,
    add(weight: number): void;
}) {
    const [value, setValue] = useState("100");

    const {colors} = useTheme();

    return (
        <View>
            <BottomSheetHeader>Add Category</BottomSheetHeader>
            <View style={{ padding: 12, marginLeft: 10 }}>
                <SmallText
                    style={{marginBottom: 10}}>
                    Weight
                </SmallText>
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
                        alignSelf: 'flex-start',
                        borderRadius: 8
                    }}
                    placeholder={"Weight"}
                    onChangeText={setValue} />
            </View>
            <View style={{ padding: 12 }}>
                <Button title="Add" onPress={() => {
                    props.add(parseInt(value));
                    props.close();
                }}/>
            </View>
        </View>
    )
}