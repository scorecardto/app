import React, {useContext} from "react";
import BottomSheetContext from "../util/BottomSheet/BottomSheetContext";
import firestore from "@react-native-firebase/firestore";
import ScorecardModule from "../../lib/expoModuleBridge";
import {BottomSheetView} from "@gorhom/bottom-sheet";
import {Dimensions, View} from "react-native";
import BottomSheetHeader from "../util/BottomSheet/BottomSheetHeader";
import RenderHTML from "react-native-render-html";

export default function AlertFetcher(): undefined {
    const sheets = useContext(BottomSheetContext);

    firestore().collection("alerts").get().then(snapshot => {
        const seen = JSON.parse(ScorecardModule.getItem("seenAlerts")) ?? [];

        for (const doc of snapshot.docs) {
            if (!seen.includes(doc.id)) {
                seen.push(doc.id)
                sheets?.addSheet(p => <BottomSheetView><RenderHTML
                    contentWidth={Dimensions.get("window").width}
                    source={{html: doc.get<string>("html")}}
                /></BottomSheetView>)
            }
        }
        ScorecardModule.storeItem("seenAlerts", JSON.stringify(seen))
    })
}