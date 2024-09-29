import React, {useContext, useState} from "react";
import {Dimensions, TouchableOpacity, View} from "react-native";
import BottomSheetHeader from "../../util/BottomSheet/BottomSheetHeader";
import useColors from "../theme/useColors";
import MediumText from "../../text/MediumText";
import Button from "../../input/Button";
import BottomSheetContext from "../../util/BottomSheet/BottomSheetContext";
import SmallText from "../../text/SmallText";
import RenderHTML from "react-native-render-html";

export default function AlertBody(props: { data: {title: string, body: string}[], close(): void }) {
    const [index, setIndex] = useState(0);

    const colors = useColors();
    return (
        <View>
            <BottomSheetHeader>{props.data[index].title}</BottomSheetHeader>
            <View style={{
                width: "90%",
                alignSelf: "center",
            }}>
                <RenderHTML
                    baseStyle={{color: colors.text, alignItems: "center", lineHeight: 21}}
                    contentWidth={Dimensions.get("window").width}
                    source={{html: props.data[index].body}}
                />
            </View>
            <View style={{
                marginTop: 10,
                marginBottom: 20,
            }}>
                {index < props.data.length-1 ? <>
                    <Button buttonStyle={"small"} onPress={() => setIndex(index + 1)}>Next</Button>
                    <TouchableOpacity style={{
                        alignItems: "center",
                        marginTop: 10,
                    }} onPress={props.close}>
                        <SmallText style={{
                            color: colors.text,
                        }}>Close</SmallText>
                    </TouchableOpacity>
                </> : <Button buttonStyle={"small"} onPress={props.close}>Close</Button>}
            </View>
        </View>
    )
}