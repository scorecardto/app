import React, { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import Toast from "react-native-toast-message";

import * as Font from "expo-font";
import { AnekKannada_400Regular } from "@expo-google-fonts/anek-kannada";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { IBMPlexMono_400Regular } from "@expo-google-fonts/ibm-plex-mono";
import initialize from "../../lib/init";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./state/store";
import { setFcmToken } from "../../lib/backgroundNotifications";

export default function AppInitializer(props: {
  setAppReady: React.Dispatch<React.SetStateAction<boolean>>;
  setNextScreen: React.Dispatch<React.SetStateAction<string>>;
  resetKey: string;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const currentGradeCategory = useSelector(
    (s: RootState) => s.gradeData.record?.gradeCategory
  );
  const recordGradeCategory = useSelector(
    (s: RootState) => s.gradeData.record?.gradeCategory
  );

  const [userReady, setUserReady] = useState(false);

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    // user?.getIdToken().then(console.log);
    user?.getIdToken().then(setFcmToken);

    if (!userReady) setUserReady(true);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (currentGradeCategory !== recordGradeCategory) {
      Toast.show({
        type: "info",
        text1: "Older Grading Period",
        text2:
          "Some grade data is unavailable and grade testing may be innacurate.",
        visibilityTime: 5000,
        position: "bottom",
      });
    }
  }, [currentGradeCategory, recordGradeCategory]);

  useEffect(() => {
    async function prepare() {
      props.setAppReady(false);

      console.log("Preparing app data...");

      const fontsAsync = Font.loadAsync({
        AnekKannada_400Regular: AnekKannada_400Regular,
        DMSans_400Regular: DMSans_400Regular,
        DMSans_500Medium: DMSans_500Medium,
        DMSans_700Bold: DMSans_700Bold,
        IBMPlexMono_400Regular: IBMPlexMono_400Regular,
      });

      const nextScreenAsync = initialize(dispatch, user);

      const [_, nextScreen] = await Promise.all([fontsAsync, nextScreenAsync]);

      props.setNextScreen(nextScreen);

      props.setAppReady(true);
    }

    if (userReady) {
      prepare();
    }
  }, [userReady, props.resetKey]);

  return <></>;
}
