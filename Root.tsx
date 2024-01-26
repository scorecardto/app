import React, {Dispatch, SetStateAction, useState} from "react";
import {View} from "react-native";
import App from "./App";
import Storage from "expo-storage";
import {setReloadApp} from './lib/reloadApp';

export default function Root() {
    const [key, setKey] = useState(0);
    setReloadApp(() => setKey(key+1));

    return (
        <App key={`${key}`} />
    )
}