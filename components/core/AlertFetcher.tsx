import React, {useContext} from "react";
import BottomSheetContext from "../util/BottomSheet/BottomSheetContext";
import firestore from "@react-native-firebase/firestore";
import ScorecardModule from "../../lib/expoModuleBridge";
import WebView from "react-native-webview";

export default function AlertFetcher(): undefined {
    const sheets = useContext(BottomSheetContext);

    firestore().collection("alerts").get().then(snapshot => {
        const seen = JSON.parse(ScorecardModule.getItem("seenAlerts"))

        for (const doc of snapshot.docs) {
            if (!seen.includes(doc.id)) {
                sheets?.addSheet(s => <WebView
                    originWhitelist={['*']}
                    source={{html: doc.get<string>("html")}}
                />)
            }
        }
    })
}