import Storage from "expo-storage";
import * as Crypto from "expo-crypto";
import * as Device from "expo-device";

export async function getDeviceId() {
    const deviceId = await Storage.getItem({ key: "deviceId" });

    if (!deviceId) {
        const id = Crypto.randomUUID();
        await Storage.setItem({ key: "deviceId", value: id });

        return id;
    }

    return deviceId;
}

export function getDeviceDescriptor() {
    return `${Device.brand} ${Device.modelName} [${Device.deviceType}] (${Device.osName} ${Device.osVersion} - ${Device.osInternalBuildId})`;
}