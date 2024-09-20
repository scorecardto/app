import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { AppState, Platform } from "react-native";
import * as Device from "expo-device";
import * as Crypto from "expo-crypto";
import axios, { Response } from "redaxios";
import {Notification, NotificationResponse} from "expo-notifications";
import { store } from "../components/core/state/store";
import {
  fetchAllContent,
} from "./fetcher";
import { AppDispatch, RootState } from "../components/core/state/store";
import { Course, CourseSettings, GradebookRecord } from "scorecard-types";
import RefreshStatus from "./types/RefreshStatus";
import { setRefreshStatus } from "../components/core/state/grades/refreshStatusSlice";
import fetchAndStore from "./fetchAndStore";
import Toast from "react-native-toast-message";
import captureCourseState from "./captureCourseState";
import { getDeviceId } from "./deviceInfo";
import { updateCourseIfPinned } from "../components/core/state/widget/widgetSlice";
import { NavigationContainerRef } from "@react-navigation/native";
import { TaskManagerTaskBody } from "expo-task-manager/src/TaskManager";
import ScorecardModule from "./expoModuleBridge";

const BACKGROUND_FETCH_TASK = "BACKGROUND-FETCH-TASK";

export async function setupBackgroundNotifications() {
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    if (AppState.currentState === "active") return BackgroundFetch.BackgroundFetchResult.NoData;

    const { username, password, host } = JSON.parse(ScorecardModule.getItem("login") ?? "{}");
    if (!username || !password || !host) return;

    const courseSettings = JSON.parse(ScorecardModule.getItem("courseSettings") ?? "{}");

    const reportCard = await fetchAllContent(
        host,
        (JSON.parse(ScorecardModule.getItem("records") ?? "[]"))[0].courses.length,
        username,
        password);

    const getName = (key: string) =>
        courseSettings[key]?.displayName ??
        reportCard.courses.find((c) => c.key === key)?.name ??
        key;

    const toNotify = (
        await fetchAndStore(reportCard, store.dispatch, false)
    ).filter((c) => !courseSettings[c]?.hidden);

    if (toNotify.length > 0) {
      const single = toNotify.length == 1;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: single ? getName(toNotify[0]) : "New grades",
          body: single
              ? "New grades are available. Tap to go to your Scorecard."
              : `${toNotify.length} courses have been updated. Tap to go to your Scorecard.`,
          data: { course: single ? toNotify[0] : undefined },
        },
        trigger: null,
      });
    }

    return toNotify.length > 0
        ? BackgroundFetch.BackgroundFetchResult.NewData
        : BackgroundFetch.BackgroundFetchResult.NoData;
  });

  await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 60, // an hour
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

export function setupForegroundNotifications(
  navigation: NavigationContainerRef<{ [idx: string]: any }>
) {
  Notifications.setNotificationHandler({
    handleNotification: async (notification: Notification) => {
      return {
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
      };
    }
  });

  const listener = (response: NotificationResponse | null) => {
    if (!response) return;

    const { data } = response.notification.request.content;
    if (data.course) {
      navigation.navigate({ name: "course", params: { key: data.course } });
    } else if (data.clubCode) {
      navigation.navigate({ name: "viewClub", params: { internalCode: data.clubCode } });
    }
  };
  Notifications.getLastNotificationResponseAsync().then(listener);

  return Notifications.addNotificationResponseReceivedListener(listener).remove;
}


let token: string | undefined;

export function getCurrentToken() {
  return token;
}
export async function requestPermissions() {
  if (token) return;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }
    token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "6bea7059-7418-45b5-979f-2df2a8758239",
        })
    ).data;
  } else {
    console.log("Must use physical device for Push Notifications");
    return;
  }
}
