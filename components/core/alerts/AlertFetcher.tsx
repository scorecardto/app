import React, {useContext} from "react";
import BottomSheetContext from "../../util/BottomSheet/BottomSheetContext";
import firestore from "@react-native-firebase/firestore";
import ScorecardModule from "../../../lib/expoModuleBridge";
import {BottomSheetView} from "@gorhom/bottom-sheet";
import AlertBody from "./AlertBody";

export default function AlertFetcher(): undefined {
    const sheets = useContext(BottomSheetContext);

    firestore().collection("alerts").get().then(snapshot => {
        const seen = JSON.parse(ScorecardModule.getItem("seenAlerts") || "[]");

        for (const doc of snapshot.docs) {
            if (!seen.includes(doc.id)) {
                seen.push(doc.id)

                const pages = doc.data()?.pages;
                if (!pages?.length) continue;

                sheets?.addSheet(p => <BottomSheetView><AlertBody data={pages} close={p.close} /></BottomSheetView>)
            }
        }
        ScorecardModule.storeItem("seenAlerts", JSON.stringify(seen))
    })
}