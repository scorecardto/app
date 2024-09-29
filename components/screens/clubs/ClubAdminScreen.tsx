import { Platform, ScrollView as AndroidScrollView, View } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import useColors from "../../core/theme/useColors";
import ClubAdminToolbar from "../../app/clubs/ClubAdminToolbar";
import ClubCustomizeView from "../../app/clubs/ClubCustomizeView";
import CourseSaveArrayContainer from "../../app/course/CourseSaveArrayContainer";
import { Club } from "scorecard-types";
import useScApi from "../../util/hooks/useScApi";
import ClubHomeView from "../../app/clubs/ClubHomeView";
import {
  KeyboardAwareScrollView as iOSScrollView,
  KeyboardProvider,
} from "react-native-keyboard-controller";
import useSocial from "../../util/hooks/useSocial";
import ClubMembersView from "../../app/clubs/ClubMembersView";

export default function ClubAdminScreen(props: {
  navigation: NavigationProp<any, any>;
  route: any;
}) {
  const { internalCode } = props.route.params;

  const colors = useColors();
  const navigation = useNavigation();

  const [tab, setTab] = useState("home");

  const [club, setClub] = useState<Club | null>(null);
  const [activeClub, setActiveClub] = useState<Club | null>(null);

  const [loading, setLoading] = useState(false);
  const [forceLoading, setForceLoading] = useState(false);

  const api = useScApi();

  const fetchClub = useCallback(async () => {
    await api
      .get({
        pathname: "/v1/clubs/get",
        params: {
          internalCode,
        },
        auth: true,
      })
      .then((result) => {
        setClub(result.data.club);
      });
  }, [internalCode]);

  const social = useSocial();
  const updateClub = useCallback((c: Club) => {
    api
      .post({
        pathname: "/v1/clubs/update",
        body: {
          club: c,
        },
        auth: true,
      })
      .then((result) => {
        social.refreshClubs();
        fetchClub().then(() => {
          setLoading(false);
          setForceLoading(false);
        });
      });
  }, []);

  useEffect(() => {
    fetchClub();
  }, []);

  useEffect(() => {
    if (
      !loading &&
      activeClub &&
      JSON.stringify(activeClub) !== JSON.stringify(club)
    ) {
      const t = setTimeout(() => {
        setLoading(true);
        updateClub(activeClub);
      }, 1500);

      return () => {
        clearTimeout(t);
      };
    }
  }, [club, activeClub]);

  useEffect(() => {
    console.log(club);
  }, [club]);

  const ScrollView = Platform.OS === "ios" ? iOSScrollView : AndroidScrollView;
  return (
    <View
      style={{
        height: "100%",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <CourseSaveArrayContainer
        onPressLeft={() => {
          props.navigation.goBack();
        }}
        save={tab === "edit"}
        hideRight
        canSave={JSON.stringify(activeClub) !== JSON.stringify(club)}
        saving={forceLoading || loading}
        onPressRight={() => {}}
      />
      <View
        style={{
          flexShrink: 0,
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
          }}
        >
          <ClubAdminToolbar tab={tab} setTab={setTab} club={club} />
        </View>
      </View>
      <View
        style={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingVertical: 4,
          flex: 1,
        }}
      >
        {club ? (
          <ScrollView
            style={{
              height: "100%",
              flex: 1,
            }}
          >
            {tab === "home" && <ClubHomeView club={club} />}
            {tab === "edit" && (
              <KeyboardProvider>
                <ClubCustomizeView
                  club={club}
                  startLoading={() => setForceLoading(true)}
                  updateClub={(c) => {
                    setActiveClub(c);
                  }}
                />
              </KeyboardProvider>
            )}
            {tab === "members" && <ClubMembersView club={club} />}
          </ScrollView>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}
