import { Club } from "scorecard-types";
import { Dimensions, Text, View } from "react-native";
import { LinearGradient } from "react-native-gradients";
import { NavigationProp } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { captureRef } from "react-native-view-shot";
import LoadingOverlay from "../../../screens/loader/LoadingOverlay";
import { CreativeKit } from "@snapchat/snap-kit-react-native";
import ScorecardClubImage from "../../../util/ScorecardClubImage";
import color from "../../../../lib/Color";
import MediumText from "../../../text/MediumText";
import ActionButton from "../../../input/ActionButton";
import * as Clipboard from "expo-clipboard";

export default function ShareClubSnapchat(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const IMAGE_SIZE = Dimensions.get("window").width / 3;

  const club = props.route.params.club as Club;

  const viewRef = useRef<View>(null);

  const [image, setImage] = useState("");
  useEffect(() => {
    if (viewRef) {
      setTimeout(
        (): any =>
          captureRef(viewRef, {
            format: "png",
            quality: 1,
            result: "base64",
          }).then((b64) => {
            setImage(`data:image/png;base64,${b64}`);
          }),
        500
      );
    }
  }, [viewRef]);

  const link = `https://${club.clubCode.toLowerCase()}.mylasa.club`;

  const push = useCallback(() => {
    CreativeKit.shareToCameraPreview({
      sticker: {
        uri: image,
        width: 280,
        height: 280,
        posX: 0.5,
        posY: 0.37,
        rotationDegreesInClockwise: 0,
        isAnimated: false,
      },
      caption: `❗ Now, tap the link button and type "${club.clubCode.toLowerCase()}.mylasa.club"`,
      attachmentUrl: link,
    }).then(() => {
      props.navigation.goBack();
    });
  }, [image]);

  return (
    <View>
      <View
        style={{
          width: "100%",
          opacity: 1,
          top: 0,
          marginTop: 64,
          position: "absolute",
          zIndex: 100,
          paddingHorizontal: 16,
          paddingBottom: 48,
        }}
      >
        <View
          style={{
            backgroundColor: color.DarkTheme.colors.card,
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 16,
          }}
        >
          <MediumText
            style={{
              fontSize: 24,
              color: color.DarkTheme.colors.primary,
              marginBottom: 8,
            }}
          >
            Take a pic, then add a link.
          </MediumText>
          <Text
            style={{
              fontSize: 18,
              color: color.DarkTheme.colors.text,
              marginBottom: 32,
            }}
          >
            Take a picture using our sticker, then follow the steps to add your
            club link.
          </Text>
          <View
            style={{
              alignSelf: "center",
            }}
          >
            <ActionButton
              type="WHITE"
              onPress={() => {
                push();
              }}
            >
              Got It
            </ActionButton>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#000000",
          width: "100%",
          height: "100%",
          opacity: 0.8,
          position: "absolute",
          zIndex: 50,
        }}
      ></View>
      <View>
        <LinearGradient
          angle={-90}
          colorList={[
            { offset: "0%", color: "#C0C5FE", opacity: "1" },
            { offset: "100%", color: "#AACEFF", opacity: "1" },
          ]}
        />

        <View
          collapsable={false}
          ref={viewRef}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              position: "absolute",
              width: "80%",
              height: "35%",
              top: "25%",
              zIndex: 10,
            }}
          >
            <View
              style={{
                width: "100%",
                position: "absolute",
                top: -IMAGE_SIZE / 2,
                alignItems: "center",
                zIndex: 10,
              }}
            >
              <View
                style={{
                  height: IMAGE_SIZE,
                  width: IMAGE_SIZE,
                  borderRadius: 130,
                  backgroundColor: "silver",
                  borderColor: "white",
                  borderWidth: 4,
                  overflow: "hidden",
                }}
              >
                <ScorecardClubImage
                  noAsync={true}
                  club={club}
                  width={IMAGE_SIZE-8}
                  height={IMAGE_SIZE-8}
                />
              </View>
            </View>
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 32,
                overflow: "hidden",
                alignItems: "center",
              }}
            >
              <LinearGradient
                angle={-90}
                colorList={[
                  { offset: "0%", color: "#5858F9", opacity: "1" },
                  { offset: "100%", color: "#3395F9", opacity: "1" },
                ]}
              />
              <View
                style={{
                  position: "absolute",
                  top: "33%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 24,
                  }}
                >
                  {club.name}
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 40,
                    fontWeight: "bold",
                    fontFamily: "LeagueSpartan_700Bold",
                    marginTop: 20,
                  }}
                >
                  Join My Club!
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  height: "25%",
                  backgroundColor: "white",
                  position: "absolute",
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 21,
                    fontWeight: "bold",
                  }}
                >
                  👇 TAP LINK 💯
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
