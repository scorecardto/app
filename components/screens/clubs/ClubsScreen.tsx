import {
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import PageThemeProvider from "../../core/context/PageThemeProvider";
import Background from "../../util/Background";
import ClubsToolbar from "../../app/clubs/ClubsToolbar";
import AllClubsList from "../../app/clubs/AllClubsList";
import useSocial from "../../util/hooks/useSocial";
import QRCode from "react-native-qrcode-svg";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import MediumText from "../../text/MediumText";
import ScorecardQRCode from "../../util/ScorecardQRCode";
import ClubRecentPostsList from "../../app/clubs/ClubRecentPostsList";
import LargeText from "../../text/LargeText";
import useColors from "../../core/theme/useColors";

export default function ClubsScreen(props: {
  navigation: NavigationProp<any, any>;
}) {
  const connected = useSelector((r: RootState) => {
    return r.social.connected;
  });

  const clubs = useSelector((r: RootState) => {
    return r.social.clubs;
  });

  const recentPosts = useSelector((r: RootState) => {
    return r.social.recentPosts;
  });

  const social = useSocial();

  useEffect(() => {
    if (connected) {
      social.refreshClubs();
    }
  }, [connected]);

  const [loading, setLoading] = useState(false);

  const svg = useRef<any>();

  const colors = useColors();
  return (
    <PageThemeProvider
      theme={{
        default: {
          background: "#EDF6FF",
          border: "#FFF2F8",
        },
      }}
    >
      <Background>
        <ScrollView
          scrollEventThrottle={16}
          style={{
            height: "100%",
          }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                setLoading(true);

                if (connected) {
                  social.refreshClubs().finally(() => {
                    setLoading(false);
                  });
                } else {
                  setLoading(true);
                }
              }}
            />
          }
        >
          {/* <Text>{connected ? "C" : "N"}</Text> */}
          <ClubsToolbar />
          <ClubRecentPostsList recentPosts={recentPosts} />
          <LargeText
            style={{
              fontSize: 18,
              marginHorizontal: 12,
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            All Clubs
          </LargeText>
          <AllClubsList clubs={clubs} />
        </ScrollView>
      </Background>
    </PageThemeProvider>
  );
}
