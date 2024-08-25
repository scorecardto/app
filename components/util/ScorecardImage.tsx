import {Image} from "react-native";
import * as FileSystem from "expo-file-system";
import {useEffect, useState} from "react";

export default function ScorecardImage(props: { id: string; width: number; height: number }) {
    const file = FileSystem.cacheDirectory + `images/${props.id}`;

    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        (async() => {
            const info = await FileSystem.getInfoAsync(file);
            if (!info.exists) {
                // TODO: just makes a document called `images`... ?
                await FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory + "images", {intermediates: true});
                await FileSystem.downloadAsync(`https://api.scorecardgrades.com/v1/images/get/${props.id}`, file);

                setRefresh(!refresh);
            }
        })();
    }, [file]);

    return <Image source={{uri: file, cache: "reload"}} key={""+refresh} width={props.width} height={props.height} />;
}