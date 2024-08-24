import {TouchableOpacity, View, Image} from "react-native";
import QRCode from "react-native-qrcode-svg";
import {useCallback, useRef} from "react";
import * as MediaLibrary from "expo-media-library"
import * as FileSystem from "expo-file-system"
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import Button from "../input/Button";
import { captureRef } from "react-native-view-shot";

export default function ScorecardQRCode(props: {
    link: string;
    size: number;
}) {
    const {link, size} = props;

    const qrView = useRef<View>(null);
    const saveAsPNG = useCallback(async () => {
         const png = await captureRef(qrView.current!, {
            format: "png",
            quality: 1,
            result: "data-uri",
            height: size,
            width: size
        });

        const uri = `${FileSystem.cacheDirectory}QR Code.png`;
        await FileSystem.writeAsStringAsync(uri, png.replace("data:image/png;base64,", ""), {encoding: 'base64'});

        return uri;
    }, []);

    const logoAreaSize = Math.floor(size*0.3-1);
    return <View>
        <View ref={qrView} style={{alignSelf: 'flex-start'}}>
            <QRCode
                value={link}
                size={size}
                logo={require("../../assets/icon.png")}
                logoSize={logoAreaSize*0.8}
                logoBackgroundColor={"#FFF"}
                logoMargin={logoAreaSize*0.2}
                quietZone={size*0.03125}
                ecl={"H"}
            />
        </View>
        <Button onPress={async () => await MediaLibrary.saveToLibraryAsync(await saveAsPNG())}>Save to Photos</Button>
        <Button onPress={async () => await Sharing.shareAsync(await saveAsPNG())}>Share</Button>
        <Button onPress={async () => {
            const uri = await saveAsPNG();
            await Clipboard.setImageAsync(await FileSystem.readAsStringAsync(uri, {encoding: 'base64'}));
        }}>Copy</Button>
    </View>
}