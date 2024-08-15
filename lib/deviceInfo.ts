import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import ScorecardModule from "./expoModuleBridge";

export async function getDeviceId() {
    const deviceId = ScorecardModule.getItem("deviceId");

    if (!deviceId) {
        const id = Crypto.randomUUID();
        ScorecardModule.storeItem("deviceId", id);

        return id;
    }

    return deviceId;
}

export function getDeviceDescriptor() {
    return `${Device.brand} ${Device.modelName} [${Device.deviceType}] (${Device.osName} ${Device.osVersion} - ${Device.osInternalBuildId})`;
}