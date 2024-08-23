import {ScrollView, View} from "react-native";
import {useEffect} from "react";
import {NavigationProp} from "@react-navigation/native";
import {useSelector} from "react-redux";
import {RootState} from "../../core/state/store";
import PageThemeProvider from "../../core/context/PageThemeProvider";
import Background from "../../util/Background";
import ClubsToolbar from "../../app/clubs/ClubsToolbar";
import AllClubsList from "../../app/clubs/AllClubsList";
import useSocial from "../../util/hooks/useSocial";

export default function ClubsScreen(props: {
  navigation: NavigationProp<any, any>;
}) {
  const connected = useSelector((r: RootState) => {
    return r.social.connected;
  });

  const clubs = useSelector((r: RootState) => {
    return r.social.clubs;
  });

  const social = useSocial();

  useEffect(() => {
    if (connected) {
      social.refreshClubs();
    }
  }, [connected]);

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
        >
          <ClubsToolbar />
          <View
            style={{
              paddingBottom: 72,
              paddingTop: 0,
            }}
          >
            <AllClubsList clubs={clubs} />
          </View>
        </ScrollView>
      </Background>
    </PageThemeProvider>
  );
}
