import {Image, Text, View} from "react-native";
import React, {useCallback, useEffect, useRef} from "react";
import MediumText from "../../text/MediumText";
import useColors from "../../core/theme/useColors";
import Button from "../../input/Button";
import * as ImagePicker from "expo-image-picker"
import {MediaTypeOptions} from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import { Image as Compressor } from "react-native-compressor";
import {FileSystemUploadType} from "expo-file-system"
import {firebase} from "@react-native-firebase/auth";
import Toast from "react-native-toast-message";
import ScorecardImage from "../../util/ScorecardImage";

export default function ClubPictureChanger(props: {
    initialValue?: string;
    startLoading: () => void;
    onChange: (image: string) => void;
}) {
  const colors = useColors();

  const fcmToken = useRef<string>();
  useEffect(() => {
      return firebase.auth().onAuthStateChanged(function (user) {
          user?.getIdToken().then(function (idToken) {
              fcmToken.current = idToken;
          });
      });
    });

  const upload = useCallback(async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1
      });
      if (result.canceled) return;

      let uri = result.assets[0].uri;
      // @ts-ignore
      const {size} = await FileSystem.getInfoAsync(uri, {size: true});
      if (size > 5 * 1024 * 1024) {
          Toast.show({text1: "Image Too Large", text2: "Compressing to 5MB"})
          uri = await Compressor.compress(uri, {
              compressionMethod: "manual",
              quality: (5 * 1024 * 1024) / size,
              input: "uri",
              output: 'png',
              returnableOutputType: 'uri'
          })
      }

      props.startLoading();
      const ret = await FileSystem.uploadAsync("https://api.scorecardgrades.com/v1/images/upload", uri, {
          headers: { "Authorization": fcmToken.current! },
          uploadType: FileSystemUploadType.MULTIPART,
          fieldName: "image"
      });
      if (ret.status != 200) return;

      const id = JSON.parse(ret.body).id;
      props.onChange(id);
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 16,
      }}
    >
      <View
        style={{
          height: 112,
          width: 112,
          borderRadius: 16,
          backgroundColor: colors.textInput,
          padding: 16,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
          {props.initialValue ?
              <ScorecardImage
                  id={props.initialValue}
                  width={112}
                  height={112} /> :
              <Text
                  onPress={upload}
                  style={{
                      color: colors.text,
                      textAlign: "center",
                      fontStyle: "italic",
                      fontSize: 12,
                  }}
              >
                Tap to add a profile picture
              </Text>
          }
      </View>
      <View
        style={{
          marginLeft: 16,
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <MediumText style={{ marginBottom: 8, color: colors.primary }}>
          Profile Picture
        </MediumText>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Button onPress={upload} small>
            Change
          </Button>
        </View>
      </View>
    </View>
  );
}
