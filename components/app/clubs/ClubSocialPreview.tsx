import { View, Text, Share } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "react-native-gradients";
import useColors from "../../core/theme/useColors";
import { MaterialIcons } from "@expo/vector-icons";
import ClubSocialMediaIcon from "./ClubSocialMediaIcon";
import MediumText from "../../text/MediumText";
import { Club } from "scorecard-types";
import { useNavigation } from "@react-navigation/native";
import ScorecardClubImage from "../../util/ScorecardClubImage";
const snapchatLogo = require("../../../assets/snapchat.svg");
const instagramLogo = require("../../../assets/instagram.svg");
export default function ClubSocialPreview(props: { club: Club }) {
  const PICTURE_SIZE = 108;

  const colors = useColors();
  const navigation = useNavigation();

  return (
    <View
      style={{
        shadowOpacity: 0.1,
        shadowColor: "rgba(0,0,0)",
        borderRadius: 16,
        shadowOffset: { height: 0, width: 0 },
        padding: 16,
        backgroundColor: colors.card,
      }}
    >
      <View
        style={{
          paddingHorizontal: 8,
        }}
      >
        <MediumText
          style={{
            color: colors.primary,
          }}
        >
          Share your Link
        </MediumText>
        <Text
          style={{
            color: colors.text,
            paddingTop: 8,
            paddingBottom: 10,
          }}
        >
          You'll reach the most people through Snapchat and Text Messages.
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          position: "relative",
          marginTop: PICTURE_SIZE / 2,
        }}
      >
        <View
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            borderRadius: 20,
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
          <Text
            style={{
              marginTop: 16,
              marginBottom: 12,
              color: "white",
              fontWeight: "600",
            }}
          >
            {props.club.name}
          </Text>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              marginBottom: 44,
              color: "white",
              fontFamily: "LeagueSpartan_700Bold",
            }}
          >
            Join My Club!
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
              borderColor: colors.card,
              borderWidth: 4,
              overflow: "hidden",
            }}
          >
            <ScorecardClubImage
              club={props.club}
              width={PICTURE_SIZE - 8}
              height={PICTURE_SIZE - 8}
            />
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            marginBottom: -16,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              paddingHorizontal: 24,
              paddingVertical: 8,
              borderRadius: 24,
              borderColor: colors.borderNeutral,
              borderWidth: 1,
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Rubik_500Medium",
              }}
            >
              👇 Share Your Link 💯
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingTop: 36,
          width: "100%",
          justifyContent: "center",
        }}
      >
        <ClubSocialMediaIcon
          label="Stories"
          onPress={() =>
            // @ts-ignore
            navigation.navigate("shareClubInstagram", { club: props.club })
          }
        >
          <Image
            source={instagramLogo}
            style={{
              width: 64,
              aspectRatio: 1,
            }}
          />
        </ClubSocialMediaIcon>
        <ClubSocialMediaIcon
          label="Best Results"
          background="#FFFC00"
          onPress={() =>
            // @ts-ignore
            navigation.navigate("shareClubSnapchat", { club: props.club })
          }
        >
          <Image
            source={snapchatLogo}
            style={{
              width: 40,
              aspectRatio: 1,
            }}
          />
        </ClubSocialMediaIcon>
        <ClubSocialMediaIcon
          label="Share via..."
          background={colors.borderNeutral}
          onPress={() => {
            Share.share({
              message: `https://scorecardgrades.com/joinclub/${props.club.clubCode}?preferInternalCode=${props.club.internalCode}`,
            });
          }}
        >
          <MaterialIcons
            name="ios-share"
            size={28}
            style={{
              color: colors.text,
            }}
          />
        </ClubSocialMediaIcon>
      </View>
    </View>
  );
}
