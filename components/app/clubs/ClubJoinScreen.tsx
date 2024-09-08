import { NavigationProp } from "@react-navigation/native";
import {
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import { LinearGradient } from "react-native-gradients";
import MaskedView from "@react-native-masked-view/masked-view";
import useScApi from "../../util/hooks/useScApi";
import ScorecardClubImage from "../../util/ScorecardClubImage";
import MediumText from "../../text/MediumText";
import Button from "../../input/Button";
import useColors from "../../core/theme/useColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LargeText from "../../text/LargeText";
import CourseCornerButtonContainer from "../course/CourseCornerButtonContainer";
import CourseCornerButton from "../course/CourseCornerButton";
import useGetEmail from "../../util/hooks/useGetEmail";
import Toast from "react-native-toast-message";
import useSocial from "../../util/hooks/useSocial";
import LoadingOverlay from "../../screens/loader/LoadingOverlay";

export default function ClubJoinScreen(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const IMAGE_SIZE = Dimensions.get("window").width / 3;

  const { clubCode } = props.route.params;

  console.log(clubCode);

  const club = useSelector((s: RootState) =>
    s.social.clubs.find((c) => c.clubCode.toLowerCase() === clubCode)
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

  const colors = useColors();
  const api = useScApi();
  const PICTURE_SIZE = 108;

  const insets = useSafeAreaInsets();

  const getEmail = useGetEmail();

  const social = useSocial();

  const [loading, setLoading] = useState(false);
  const join = useCallback(async () => {
    setLoading(true);

    getEmail().then((email: string) => {
      console.log(email);

      if (!club) {
        props.navigation.goBack();
        Toast.show({
          type: "info",
          text1: "Error",
          text2: "This club doesn't exist!",
        });
        return;
      }
      if (club?.isMember) {
        props.navigation.goBack();
        Toast.show({
          type: "info",
          text1: "You're already a member of this club!",
        });

        // @ts-ignore
        props.navigation.reset({
          index: 1,
          routes: [
            {
              name: "scorecard",
              params: {
                initialRouteName: "Clubs",
              },
            },
            {
              name: "viewClub",
              params: {
                internalCode: club?.internalCode,
              },
            },
          ],
        });

        return;
      }

      console.log({
        email,
        internalCode: club.internalCode,
      });

      api
        .post({
          pathname: "/v1/clubs/join",
          auth: true,
          body: {
            email,
            internalCode: club.internalCode,
          },
        })
        .then(() => {
          Toast.show({
            type: "info",
            text1: `Welcome to ${club.name}!`,
            text2: `You are now a member of this club.`,
          });
          // @ts-ignore
          props.navigation.reset({
            index: 1,
            routes: [
              {
                name: "scorecard",
                params: {
                  initialRouteName: "Clubs",
                },
              },
              {
                name: "viewClub",
                params: {
                  internalCode: club?.internalCode,
                },
              },
            ],
          });
        })
        .catch((e) => {
          console.error(e);

          Toast.show({
            type: "info",
            text1: `Error Occured`,
            text2: `Something went wrong trying to join this club.`,
          });
        })
        .finally(() => {
          social.refreshClubs().then(() => {
            setLoading(false);
          });
        });
    });
  }, []);

  return !club ? (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <View>
          <MediumText
            style={{
              fontSize: 20,
              textAlign: "center",
              color: colors.primary,
            }}
          >
            Club Not Found
          </MediumText>
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              marginBottom: 32,
              marginTop: 8,
              paddingHorizontal: "20%",
              color: colors.text,
            }}
          >
            Try searching manually in the clubs menu.
          </Text>
          <Button
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            Back Home
          </Button>
        </View>
      </View>
    </>
  ) : (
    <View
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <LoadingOverlay show={loading} />
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        <LinearGradient
          angle={-90}
          colorList={[
            { offset: "0%", color: "#C0C5FE", opacity: "1" },
            { offset: "100%", color: "#AACEFF", opacity: "1" },
          ]}
        />
      </View>
      <SafeAreaView
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            width: "100%",
          }}
        >
          <View
            style={{
              width: "100%",
              position: "relative",
              marginTop: insets.top + 10 + PICTURE_SIZE / 2,
            }}
          >
            <View
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                borderRadius: 32,
                overflow: "hidden",
              }}
            >
              <LinearGradient
                angle={45}
                colorList={[
                  { offset: "0%", color: "#5757FF", opacity: "1" },
                  { offset: "100%", color: "#2F97F8", opacity: "1" },
                ]}
              ></LinearGradient>
            </View>
            <View
              style={{
                position: "absolute",
                paddingBottom: PICTURE_SIZE / 2,
                height: "100%",
                top: 0,
                left: 0,
                width: "100%",
              }}
            ></View>
            <View
              style={{
                alignItems: "center",
                flexDirection: "column",
                marginTop: PICTURE_SIZE / 2,
              }}
            >
              <LargeText
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  marginTop: 24,
                  color: "white",
                }}
              >
                {club.name}
              </LargeText>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  marginTop: 16,
                  marginBottom: 32,
                }}
              >
                Would you like to join this club?
              </Text>
            </View>

            <View
              style={{
                width: "100%",
                height: PICTURE_SIZE,
                position: "absolute",
                top: PICTURE_SIZE / -2,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  height: PICTURE_SIZE,
                  width: PICTURE_SIZE,
                  //   borderRadius: 16,
                  borderRadius: PICTURE_SIZE,
                  backgroundColor: "silver",
                  borderColor: "#FFFFFF",
                  borderWidth: 4,
                  overflow: "hidden",
                }}
              >
                <ScorecardClubImage
                  club={club}
                  width={PICTURE_SIZE - 8}
                  height={PICTURE_SIZE - 8}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (!loading) join();
            }}
          >
            <View
              style={{
                backgroundColor: "black",
                borderRadius: 40,
                alignSelf: "center",
                marginTop: 36,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 24,
                  paddingVertical: 16,
                  paddingHorizontal: 40,
                  fontWeight: "700",
                }}
              >
                Join
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              // width: "100%",
              // height: "30%",
              // borderRadius: 20,
              marginTop: 32,
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
                color: "#000000",
                fontSize: 18,
              }}
            >
              Decline
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          paddingHorizontal: 16,
          paddingTop: 24,
        }}
      >
        <View
          pointerEvents="box-none"
          style={[
            {
              zIndex: 50,
              paddingTop: 32,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
        >
          <CourseCornerButton
            side={"left"}
            icon={"close"}
            iconPadding={0}
            iconSize={28}
            onPress={() => {
              props.navigation.goBack();
            }}
          />
        </View>
      </View>
    </View>
  );
}
