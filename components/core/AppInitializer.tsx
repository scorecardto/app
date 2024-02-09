import React, { useContext, useEffect, useState } from "react";
import { MobileDataContext } from "./context/MobileDataContext";
import { DataContext } from "scorecard-types";
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
import { useDispatch } from "react-redux";
import { AppDispatch } from "./state/store";

export default function AppInitializer(props: {
  setAppReady: React.Dispatch<React.SetStateAction<boolean>>;
  setNextScreen: React.Dispatch<React.SetStateAction<string>>;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const mobileData = useContext(MobileDataContext);
  const data = useContext(DataContext);

  const [userReady, setUserReady] = useState(false);

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (!userReady) setUserReady(true);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (data.gradeCategory !== data.data?.gradeCategory) {
      Toast.show({
        type: "info",
        text1: "Older Grading Period",
        text2:
          "Some grade data is unavailable and grade testing may be innacurate.",
        visibilityTime: 5000,
        position: "bottom",
      });
    }
  }, [data.gradeCategory]);

  useEffect(() => {
    async function prepare() {
      const fontsAsync = Font.loadAsync({
        AnekKannada_400Regular: AnekKannada_400Regular,
        DMSans_400Regular: DMSans_400Regular,
        DMSans_500Medium: DMSans_500Medium,
        DMSans_700Bold: DMSans_700Bold,
        IBMPlexMono_400Regular: IBMPlexMono_400Regular,
      });

      const nextScreenAsync = initialize(data, mobileData, user, dispatch);

      const [_, nextScreen] = await Promise.all([fontsAsync, nextScreenAsync]);

      props.setNextScreen(nextScreen);

      props.setAppReady(true);
    }

    if (userReady) {
      prepare();
    }
  }, [userReady]);
  return <></>;
}
