import { Club } from "scorecard-types";
import ReactNative, { Dimensions, Text, View } from "react-native";
import { LinearGradient } from "react-native-gradients";
import { NavigationProp } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import { captureRef } from "react-native-view-shot";
import { shareToInsta } from "../../../../lib/shareToInsta";
import LoadingOverlay from "../../../screens/loader/LoadingOverlay";
import ScorecardClubImage from "../../../util/ScorecardClubImage";
import MediumText from "../../../text/MediumText";
import color from "../../../../lib/Color";
import Button from "../../../input/Button";
import ActionButton from "../../../input/ActionButton";

export default function ShareClubInstagram(props: {
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
        () =>
          captureRef(viewRef, {
            format: "png",
            quality: 1,
            result: "base64",
          }).then((b64) => {
            setImage(`data:image/png;base64,${b64}`);
          }),
        100
      );
    }
  }, [viewRef]);

  const push = useCallback(() => {
    shareToInsta(
      image,
      `https://${club.clubCode.toLowerCase()}.mylasa.club`
    ).then(props.navigation.goBack);
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
            Use the Sticker Button
          </MediumText>
          <Text
            style={{
              fontSize: 20,
              color: color.DarkTheme.colors.text,
              marginBottom: 32,
            }}
          >
            To let people join your club, add a link sticker and paste the URL
            on your clipboard.
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: color.DarkTheme.colors.text,
              marginBottom: 32,
            }}
          >
            If you don't see a story, just come back and try again.
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
      <View collapsable={false} ref={viewRef}>
        <LinearGradient
          angle={-90}
          colorList={[
            { offset: "0%", color: "#191A4B", opacity: "1" },
            { offset: "100%", color: "#1E395C", opacity: "1" },
          ]}
        />

        <View
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
              width: "85%",
              height: "25%",
              top: "30%",
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
                  width={IMAGE_SIZE}
                  height={IMAGE_SIZE}
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
                  { offset: "80%", color: "#3395F9", opacity: "1" },
                ]}
              />
              <View
                style={{
                  position: "absolute",
                  top: "35%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: 18,
                  }}
                >
                  {club.name}
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 44,
                    fontWeight: "bold",
                    fontFamily: "LeagueSpartan_700Bold",
                    marginTop: 16,
                  }}
                >
                  Join My Club!
                </Text>
              </View>
              <View
                style={{
                  position: "absolute",
                  alignItems: "center",
                  bottom: "10%",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  👇 USE THIS LINK 💯
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            height: "8%",
            top: "55%",
            backgroundColor: "#253A63",
            position: "absolute",
            borderColor: "#3982DC",
            borderWidth: 3,
            borderRadius: 16,
            marginTop: 12,
            paddingHorizontal: 12,
            borderStyle: "dashed",
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Arial",
              fontWeight: "bold",
              color: "#3982DC",
              marginBottom: 3,
            }}
          >
            Paste A Link Sticker Here, So It's Clickable
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              fontFamily: "Arial",
              color: "#3982DC",
            }}
          >
            {club.clubCode.toUpperCase()}.MYLASA.CLUB
          </Text>
        </View>
      </View>
    </View>
  );
}
