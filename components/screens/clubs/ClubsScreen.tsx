import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../core/state/store";
import PageThemeProvider from "../../core/context/PageThemeProvider";
import Background from "../../util/Background";
import ClubsToolbar from "../../app/clubs/ClubsToolbar";
import AllClubsList from "../../app/clubs/AllClubsList";
import useSocial from "../../util/hooks/useSocial";
import ClubRecentPostsList from "../../app/clubs/ClubRecentPostsList";
import LargeText from "../../text/LargeText";
import useColors from "../../core/theme/useColors";
import MediumText from "../../text/MediumText";
import Button from "../../input/Button";

export default function ClubsScreen(props: {
  navigation: NavigationProp<any, any>;
}) {
  const connected = useSelector((r: RootState) => {
    return r.social.connected;
  });

  const school = useSelector((r: RootState) => {
    return r.social.school;
  });

  const clubs = useSelector((r: RootState) => {
    return r.social.clubs;
  });

  const recentPosts = useSelector((r: RootState) => {
    return r.social.recentPosts;
  });

  const social = useSocial();

  const email = useSelector((r: RootState) => r.social.preferredEmail);

  useEffect(() => {
    if (connected) {
      social.refreshClubs();
    }
  }, [connected]);

  const [loading, setLoading] = useState(false);

  const svg = useRef<any>();

  const colors = useColors();

  if (!connected) {
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
          <View
            style={{
              height: "100%",
            }}
          >
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 16,
                margin: 16,
                shadowColor: "#000000",
                paddingHorizontal: 24,
                paddingVertical: 16,
                shadowRadius: 8,
                shadowOpacity: 0.1,
                shadowOffset: {
                  height: 0,
                  width: 0,
                },
              }}
            >
              <MediumText
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  color: colors.primary,
                }}
              >
                Couldn't Access Clubs
              </MediumText>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 16,
                  marginBottom: 16,
                  color: colors.text,
                }}
              >
                Something went wrong connecting to Scorecard's servers.
              </Text>
              <Button
                onPress={() => {
                  props.navigation.navigate("Grades", {
                    refreshForClubs: true,
                  });
                }}
              >
                Try Again
              </Button>
            </View>
          </View>
        </Background>
      </PageThemeProvider>
    );
  }
  if (!school?.verified) {
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
          <View
            style={{
              height: "100%",
            }}
          >
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 16,
                margin: 16,
                shadowColor: "#000000",
                paddingHorizontal: 24,
                paddingVertical: 16,
                shadowRadius: 8,
                shadowOpacity: 0.1,
                shadowOffset: {
                  height: 0,
                  width: 0,
                },
              }}
            >
              <MediumText
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  color: colors.primary,
                }}
              >
                Clubs Not Available
              </MediumText>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 16,
                  marginBottom: 16,
                  color: colors.text,
                }}
              >
                Your school,{" "}
                {school?.displayName || school?.name || "[No Name Found]"}, is
                not verified to host clubs yet.
              </Text>
              <Button
                onPress={() => {
                  props.navigation.navigate("Grades", {
                    refreshForClubs: true,
                  });
                }}
              >
                Try Again
              </Button>
            </View>
          </View>
        </Background>
      </PageThemeProvider>
    );
  }
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
          <ClubsToolbar />

          <ClubRecentPostsList recentPosts={recentPosts} />
          <LargeText
            style={{
              fontSize: 18,
              marginHorizontal: 12,
              marginTop: 16,
              marginBottom: 8,
              color: colors.primary,
            }}
          >
            My Clubs
          </LargeText>
          <AllClubsList clubs={clubs.filter(c => c.isMember)} />
            <LargeText
                style={{
                    fontSize: 18,
                    marginHorizontal: 12,
                    marginTop: 16,
                    marginBottom: 8,
                    color: colors.primary,
                }}
            >
                Discover
            </LargeText>
            <AllClubsList clubs={clubs.filter(c => !c.isMember)} />
        </ScrollView>
      </Background>
    </PageThemeProvider>
  );
}
