import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import {Platform} from "react-native";
import * as Device from "expo-device";
import * as Crypto from "expo-crypto";
import axios, {Response} from "redaxios";
import {Notification} from "expo-notifications";
import {fetchAllContent, fetchGradeCategoriesForCourse, fetchReportCard} from "./fetcher";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../components/core/state/store";
import Storage from "expo-storage";
import {CourseSettings} from "scorecard-types";
import RefreshStatus from "./types/RefreshStatus";
import {setRefreshStatus} from "../components/core/state/grades/refreshStatusSlice";
import fetchAndStore from "./fetchAndStore";
import Toast from "react-native-toast-message";

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

let fcmToken: string | undefined;
export function setFcmToken(token: string | undefined) {
    fcmToken = token;
}

export async function setupBackgroundNotifications() {
    TaskManager.defineTask(
        BACKGROUND_NOTIFICATION_TASK,
        async ({ data, error, executionInfo }) => {
            const body = (data as any).body;

            const response = await axios.post("https://scorecardgrades.com/api/silent_verification", {
                id: body.id,
                fcmToken
            });

            const { username, password, host } = JSON.parse(await Storage.getItem({ key: "login" }) ?? "{}");
            if (!username || !password || !host) return;

            const record = JSON.parse(await Storage.getItem({ key: "records" }) ?? "[]")[0];
            if (!record) return;

            const reportCard = await fetchReportCard(username, password, host);
            const course = reportCard.courses.find(c=>c.key === body.courseId);
            if (!course) return;

            const gradeCategories = await fetchGradeCategoriesForCourse(
                host, reportCard.sessionId,
                reportCard.referer, course
            );

            if (JSON.stringify(gradeCategories.gradeCategories) != JSON.stringify(record)) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: body.displayName,
                        body: "New grades are available. Tap to go to your Scorecard.",
                    },
                    trigger: null,
                });
            }
        },
    );

    await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
}

export async function setupForegroundNotifications() {
    // will not receive silent push notifications in foreground
    Notifications.setNotificationHandler({
        handleNotification: async (notification: Notification) => {
            const dispatch = useDispatch<AppDispatch>();

            const district = useSelector((state: RootState) => state.login.district);
            const username = useSelector((state: RootState) => state.login.username);
            const password = useSelector((state: RootState) => state.login.password);

            Toast.show({
                type: "info",
                text1: notification.request.content.data.displayName,
                text2:
                    "Fetching new grades now. Check back in a few seconds.",
                visibilityTime: 3000,
            });

            const reportCard = await fetchAllContent(
                district,
                username,
                password,
                undefined,
                (s: RefreshStatus) => {
                    dispatch(setRefreshStatus(s));
                }
            );

            await fetchAndStore(reportCard, dispatch, false);

            return { shouldShowAlert: false, shouldPlaySound: false, shouldSetBadge: false };
        },
    });
}

async function getExpoToken() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId: '6bea7059-7418-45b5-979f-2df2a8758239' })).data;
    } else {
        console.log('Must use physical device for Push Notifications');
        return;
    }

    return token;
}

let token: string | undefined;

// the actual result will be in `response.data.result`
export async function isRegisteredForNotifs(courseId: string|string[]): Promise<Response<any>|undefined> {
    if (!token) {
        await requestPermissions();
        if (!token) return;
    }

    let body = {
        method: 'isRegistered',
        fcmToken,
        expoPushToken: token,
        deviceId: await getDeviceId(),
    };
    // @ts-ignore
    body[typeof(courseId) === 'string' ? "courseId" : "courseIds"] = courseId;

    return await axios.post("https://scorecardgrades.com/api/notifications", body);
}
export async function registerNotifs(courseId: string, courseName?: string, onetime?: boolean): Promise<Response<any>|undefined> {
    if (!token) {
        await requestPermissions();
        if (!token) return;
    }

    return await axios.post("https://scorecardgrades.com/api/notifications", {
        method: 'register',
        fcmToken,
        expoPushToken: token,
        deviceId: await getDeviceId(),
        courseId,
        courseName,
        onetime,
    })
}
export async function deregisterNotifs(courseId: string): Promise<Response<any>|undefined> {
    if (!token) {
        await requestPermissions();
        if (!token) return;
    }

    return await axios.post("https://scorecardgrades.com/api/notifications", {
        method: 'deregister',
        fcmToken,
        expoPushToken: token,
        courseId,
        deviceId: await getDeviceId(),
    })
}

export async function updateNotifs(courseId: string, assignmentId: string): Promise<Response<any>|undefined> {
    return await axios.post("https://scorecardgrades.com/api/notifications", {
        method: 'update',
        fcmToken,
        courseId,
        deviceId: await getDeviceId(),
        assignmentId
    });
}

async function getDeviceId() {
    const deviceId = await Storage.getItem({key: "deviceId"});

    if (!deviceId) {
        const id = Crypto.randomUUID();
        await Storage.setItem({key: "deviceId", value: id});

        return id;
    }

    return deviceId;
}

export async function requestPermissions() {
    token = await getExpoToken();
}