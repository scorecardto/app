import { Club } from "scorecard-types";
import { Dimensions, Text, View } from "react-native";
import { LinearGradient } from "react-native-gradients";
import { NavigationProp } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { Image } from "expo-image";
import { captureRef } from "react-native-view-shot";
import { shareToInsta } from "../../../../lib/shareToInsta";
import LoadingOverlay from "../../../screens/loader/LoadingOverlay";
import ScorecardClubImage from "../../../util/ScorecardClubImage";

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
            shareToInsta(
              `data:image/png;base64,${b64}`,
              `https://${club.clubCode.toLowerCase()}.mylasa.club`
            ).then(props.navigation.goBack);
          }),
        800000
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
              width: "85%",
              height: "30%",
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
              color: "red",
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
            }}
          >
            {club.clubCode.toUpperCase()}.MYLASA.CLUB
          </Text>
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
            Your friends are using Scorecard to manage classes and join clubs!
          </Text>
        </View>
      </View>
    </View>
  );
}
