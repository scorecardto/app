import { Club } from "scorecard-types";
import { Dimensions, Text, View } from "react-native";
import { LinearGradient } from "react-native-gradients";
import { NavigationProp } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { captureRef } from "react-native-view-shot";
import LoadingOverlay from "../../../screens/loader/LoadingOverlay";
import { CreativeKit } from "@snapchat/snap-kit-react-native";
import ScorecardClubImage from "../../../util/ScorecardClubImage";

export default function ShareClubSnapchat(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const IMAGE_SIZE = Dimensions.get("window").width / 3;

  const club = props.route.params.club as Club;

  const viewRef = useRef<View>(null);

  useEffect(() => {
    if (viewRef) {
      setTimeout(
        (): any =>
          captureRef(viewRef, {
            format: "png",
            quality: 1,
            result: "base64",
          }).then((b64) => {
            CreativeKit.shareToCameraPreview({
              sticker: {
                uri: `data:image/png;base64,${b64}`,
                width: 280,
                height: 280,
                posX: 0.5,
                posY: 0.37,
                rotationDegreesInClockwise: 0,
                isAnimated: false,
              },
              // TODO: just... doesn't work
              attachmentUrl: "https://scorecardgrades.com", // ${club.code}.mylasa.club
            }).then(props.navigation.goBack);
          }),
        800
      );
    }
  }, [viewRef]);

  return (
    <View>
      <LoadingOverlay show={true} />
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
                  club={club}
                  width={IMAGE_SIZE}
                  height={IMAGE_SIZE}
                />
              </View>
            </View>
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 20,
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
                    fontSize: 16,
                  }}
                >
                  {club.name}
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 28,
                    fontWeight: "bold",
                    marginTop: 9,
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
