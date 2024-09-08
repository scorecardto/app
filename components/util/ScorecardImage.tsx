// @ts-ignore
import AsyncImage from "react-native-async-image-animated";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import { Image } from "react-native";

export default function ScorecardImage(
  props:
    | {
        id: string;
        width: number;
        height: number;
        contain?: false;
        noAsync?: boolean;
      }
    | {
        id: string;
        noAsync?: boolean;
        contain: true;
      }
) {
  const dir = FileSystem.cacheDirectory + "images/";
  const file = dir + props.id;

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!props.id) return;
    (async () => {
      const info = await FileSystem.getInfoAsync(file);
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
        await FileSystem.downloadAsync(
          `https://api.scorecardgrades.com/v1/images/get/${props.id}`,
          file
        );

        setRefresh(!refresh);
      }
    })();
  }, [file]);

  if (!props.id) return null;

  if (props.noAsync && !props.contain) {
    return (
      <Image
        source={{ uri: file, cache: "reload" }}
        key={"" + refresh}
        style={{
          width: props.width,
          height: props.height,
        }}
        width={props.width}
        height={props.height}
      />
    );
  }
  if (props.contain) {
    return (
      <AsyncImage
        placeholderColor={"#cfd8dc"}
        source={{ uri: file, cache: "reload" }}
        key={"" + refresh}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    );
  } else {
    return (
      <AsyncImage
        placeholderColor={"#cfd8dc"}
        source={{ uri: file, cache: "reload" }}
        key={"" + refresh}
        style={{
          width: props.width,
          height: props.height,
        }}
        width={props.width}
        height={props.height}
      />
    );
  }
}
