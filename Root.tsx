import React, { Dispatch, SetStateAction, useState } from "react";
import { View } from "react-native";
import App from "./App";
import Storage from "expo-storage";
import { setReloadApp } from "./lib/reloadApp";
import { store } from "./components/core/state/store";
import { Provider } from "react-redux";
export default function Root() {
  const [key, setKey] = useState(0);
  setReloadApp(() => setKey(key + 1));

  return (
    <Provider store={store} key={`${key}`}>
      <App key={`${key}`} resetKey={`${key}`} />
    </Provider>
  );
}
