import { NavigationProp } from "@react-navigation/native";
import {
  Animated,
  Dimensions,
  Easing,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import { LinearGradient } from "react-native-gradients";
import MaskedView from "@react-native-masked-view/masked-view";
import useScApi from "../../util/hooks/useScApi";
import ScorecardClubImage from "../../util/ScorecardClubImage";

export default function ClubJoinScreen(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const IMAGE_SIZE = Dimensions.get("window").width / 3;

  const { clubCode } = props.route.params;

  const club = useSelector((s: RootState) =>
    s.social.clubs.find((c) => c.clubCode === clubCode)
  );

  const angle = useRef(new Animated.Value(0));
  useEffect(() => {
    Animated.loop(
      Animated.timing(angle.current, {
        toValue: 360,
        easing: Easing.linear,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const api = useScApi();

  return !club ? (
    <></>
  ) : (
    <View>
      <View>
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
                  👇 TAP BUTTON 💯
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              position: "absolute",
              width: "50%",
              height: "30%",
              justifyContent: "center",
              alignItems: "center",
              bottom: "5%",
              // backgroundColor: "rgba(162,227,246,0.47)"
            }}
          >
            <TouchableOpacity
              style={{
                width: "100%",
                height: "30%",
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#7f7ac8",
              }}
              onPress={async () => {
                // TODO: join club?
                await api.post({
                  pathname: "/v1/clubs/join",
                  auth: true,
                  body: {
                    ticker: clubCode,
                  },
                });
                props.navigation.goBack();
              }}
            >
              <MaskedView
                maskElement={
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      borderWidth: 4.5,
                      borderRadius: 20,
                    }}
                  />
                }
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Animated.View
                  style={{
                    pointerEvents: "none",
                    width: "110%",
                    height: "310%",
                    transform: [
                      {
                        rotate: angle.current.interpolate({
                          inputRange: [0, 360],
                          outputRange: ["0deg", "360deg"],
                        }),
                      },
                    ],
                  }}
                >
                  <LinearGradient
                    angle={45}
                    colorList={[
                      { offset: "20%", color: "#7b30ff", opacity: "1" },
                      { offset: "80%", color: "#f933e9", opacity: "1" },
                    ]}
                  />
                </Animated.View>
              </MaskedView>
              <Text
                style={{
                  position: "absolute",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                JOIN NOW
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                // width: "100%",
                // height: "30%",
                // borderRadius: 20,
                marginTop: 70,
                // borderWidth: 5,
                // borderColor: "rgba(0,0,0,0.35)",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                props.navigation.goBack();
              }}
            >
              <Text
                style={{
                  position: "absolute",
                  color: "#FFFFFF",
                  // fontWeight: "bold",
                  textDecorationLine: "underline",
                  fontSize: 18,
                }}
              >
                Decline
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
