import { useState } from "react";
import App from "./App";
import { setReloadApp } from "./lib/reloadApp";
import { store } from "./components/core/state/store";
import { Provider } from "react-redux";
import "react-native-url-polyfill/auto";
export default function Root() {
  const [key, setKey] = useState(0);
  setReloadApp(() => setKey(key + 1));

  return (
    <Provider store={store} key={`${key}`}>
      <App key={`${key}`} resetKey={`${key}`} />
    </Provider>
  );
}
