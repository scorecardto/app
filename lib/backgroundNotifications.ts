import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { AppState, Platform } from "react-native";
import * as Device from "expo-device";
import * as Crypto from "expo-crypto";
import axios, { Response } from "redaxios";
import { Notification } from "expo-notifications";
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

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";
const BACKGROUND_FETCH_TASK = "BACKGROUND-FETCH-TASK";

let fcmToken: string | undefined;
export function setFcmToken(token: string | undefined) {
  fcmToken = token;
}

async function backgroundTask(body: TaskManagerTaskBody<any>) {
  console.log("background notification task");
  if (AppState.currentState === "active") return;

  const id = body.data.body?.id;
  if (id) {
    console.log("making axios request");

    await axios.post("https://scorecardgrades.com/api/silent_verification", {
      id: id,
      fcmToken,
    });
  }

  console.log("getting settings");

  const { username, password, host } = JSON.parse(
      ScorecardModule.getItem("login") ?? "{}"
  );
  if (!username || !password || !host) return;

  const courseSettings = JSON.parse(
    ScorecardModule.getItem("courseSettings") ?? "{}"
  );

  console.log("getting rpc");

  const reportCard = await fetchAllContent(
      host,
      (JSON.parse(ScorecardModule.getItem("records") ?? "[]"))[0].courses.length,
      username,
      password);
  const notifs = (
    await isRegisteredForNotifs(reportCard.courses.map((c) => c.key))
  )?.data.result;

  const getName = (key: string) =>
    courseSettings[key]?.displayName ??
    reportCard.courses.find((c) => c.key === key)?.name ??
    key;

  console.log("storing");

  const toNotify = (
    await fetchAndStore(reportCard, store.dispatch, false)
  ).filter((c) => !!notifs?.find((n: any) => n.value !== "OFF" && n.key === c));

  if (toNotify.length > 0) {
    const single = toNotify.length == 1;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: single ? getName(toNotify[0]) : "New grades",
        body: single
          ? "New grades are available. Tap to go to your Scorecard."
          : `${toNotify.length} courses have been updated. Tap to go to your Scorecard.`,
        data: { stored: true, course: single ? toNotify[0] : undefined },
      },
      trigger: null,
    });
  }

  console.log("done storing");

  if (!id) {
    return toNotify.length > 0
      ? BackgroundFetch.BackgroundFetchResult.NewData
      : BackgroundFetch.BackgroundFetchResult.NoData;
  }
}

export async function setupBackgroundNotifications() {
  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, backgroundTask);
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, backgroundTask);

  await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
  await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 60, // an hour
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

export function setupForegroundNotifications(
  navigation: NavigationContainerRef<{ [idx: string]: any }>
) {
  const handleNotification = async (notification: Notification) => {
    const ret = {
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };

    if (!notification.request.content.data) return ret;

    const { district, username, password } = store.getState().login;

    Toast.show({
      type: "info",
      text1: notification.request.content.data.displayName,
      text2: "Fetching new grades now. Check back in a few seconds.",
      visibilityTime: 3000,
    });



    const reportCard = await fetchAllContent(
      district,
      (JSON.parse(ScorecardModule.getItem("records") ?? "[]"))[0].courses.length,
      username,
      password,
      undefined,
      (s: RefreshStatus) => {
        store.dispatch(setRefreshStatus(s));
      }
    );

    await fetchAndStore(reportCard, store.dispatch, false);

    return ret;
  };

  Notifications.setNotificationHandler({ handleNotification });

  const listener = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const { data } = response.notification.request.content;
      if (data.stored && data.course) {
        navigation.navigate({ name: "course", params: { key: data.course } });
      }
    }
  );

  return listener.remove;
}

async function getExpoToken() {
  let token;

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

  return token;
}

let token: string | undefined;

export function getCurrentToken() {
  return token;
}

// the actual result will be in `response.data.result`
export async function isRegisteredForNotifs(
  courseId: string | string[]
): Promise<Response<any> | undefined> {
  if (!token) {
    await requestPermissions();
    if (!token) return;
  }

  let body = {
    method: "isRegistered",
    fcmToken,
    expoPushToken: token,
    deviceId: await getDeviceId(),
  };
  // @ts-ignore
  body[typeof courseId === "string" ? "courseId" : "courseIds"] = courseId;

  return await axios.post(
    "https://scorecardgrades.com/api/notifications",
    body
  );
}
export async function registerNotifs(
  courseId: string,
  courseName?: string,
  onetime?: boolean
): Promise<Response<any> | undefined> {
  if (!token) {
    await requestPermissions();
    if (!token) return;
  }

  return await axios.post("https://scorecardgrades.com/api/notifications", {
    method: "register",
    fcmToken,
    expoPushToken: token,
    deviceId: await getDeviceId(),
    courseId,
    courseName,
    onetime,
  });
}
export async function deregisterNotifs(
  courseId: string
): Promise<Response<any> | undefined> {
  if (!token) {
    await requestPermissions();
    if (!token) return;
  }

  return await axios.post("https://scorecardgrades.com/api/notifications", {
    method: "deregister",
    fcmToken,
    expoPushToken: token,
    courseId,
    deviceId: await getDeviceId(),
  });
}

export async function updateNotifs(
  courseId: string,
  assignmentId: string
): Promise<Response<any> | undefined> {
  return await axios.post("https://scorecardgrades.com/api/notifications", {
    method: "update",
    fcmToken,
    courseId,
    deviceId: await getDeviceId(),
    assignmentId,
  });
}

export async function requestPermissions() {
  token = await getExpoToken();
}
