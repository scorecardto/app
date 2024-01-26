import React, {Dispatch, SetStateAction, useState} from "react";
import {View} from "react-native";
import App from "./App";

export function reloadApp() {
    keyState[1](keyState[0]+1);
}

let keyState: [number, Dispatch<SetStateAction<number>>];

export default function Root() {
    const [key, setKey] = keyState = useState(0);

    return (
        <App key={`${key}`} />
    )
}