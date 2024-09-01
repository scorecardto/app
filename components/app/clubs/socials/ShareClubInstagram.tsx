import { Club } from "scorecard-types";
import { Dimensions, Text, View } from "react-native";
import { LinearGradient } from "react-native-gradients";
import { NavigationProp } from "@react-navigation/native";
import ScorecardImage from "../../../util/ScorecardImage";
import React, { useEffect, useRef } from "react";
import { Image } from "expo-image";
import { captureRef } from "react-native-view-shot";
import { shareToInsta } from "../../../../lib/shareToInsta";
import { Social } from "react-native-share";
import * as Clipboard from "expo-clipboard";
import LoadingOverlay from "../../../screens/loader/LoadingOverlay";

export default function ShareClubInstagram(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const IMAGE_SIZE = Dimensions.get("window").width / 3;

  const club = props.route.params.club as Club;

  const viewRef = useRef<View>(null);

  useEffect(() => {
    if (viewRef) {
      setTimeout(
        () =>
          captureRef(viewRef, {
            format: "png",
            quality: 1,
            result: "base64",
          }).then((b64) => {
            shareToInsta(`data:image/png;base64,${b64}`).then(
              props.navigation.goBack
            );
          }),
        800
      );
    }
  }, [viewRef]);

  return (
    <View>
      <LoadingOverlay show={true} />
      <View collapsable={false} ref={viewRef}>
        <LinearGradient
          angle={-90}
          colorList={[
            { offset: "0%", color: "#C0C5FE", opacity: "1" },
            { offset: "100%", color: "#AACEFF", opacity: "1" },
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
              width: "80%",
              height: "40%",
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
                <ScorecardImage
                  id={club.picture!}
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
                  { offset: "80%", color: "#3395F9", opacity: "1" },
                ]}
              />
              <View
                style={{
                  position: "absolute",
                  top: "29%",
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
                  position: "absolute",
                  alignItems: "center",
                  bottom: "27%",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 12,
                  }}
                >
                  👇 USE THIS LINK 💯
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  height: "20%",
                  backgroundColor: "white",
                  position: "absolute",
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {club.clubCode.toUpperCase()}.MYLASA.CLUB
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            position: "absolute",
            bottom: "10%",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../../../assets/icon.svg")}
            style={{
              height: 50,
              aspectRatio: 1,
            }}
          />
          <Text
            style={{
              color: "#2683BF",
              fontSize: 14,
              fontWeight: "bold",
              width: "60%",
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Adrian C, Julia B, and 1000 Others Are Using Scorecard To Join Clubs
          </Text>
        </View>
      </View>
    </View>
  );
}
