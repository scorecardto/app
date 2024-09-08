import { useEffect, useState } from "react";
import ScorecardModule from "../../../lib/expoModuleBridge";
import DeviceInfo from "react-native-device-info";

export default function useCachedValue<T>(
  cachePathname: string,
  get: () => Promise<T>
): [T | null, boolean] {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const version = DeviceInfo.getVersion();
    const storagePathname = "cacheHook-" + version;

    const existingObject = ScorecardModule.getItem(storagePathname);

    const existing = existingObject ? JSON.parse(existingObject) : null;

    if (existing && existing[cachePathname]) {
      setValue(existing[cachePathname]);
    }

    get().then((value) => {
      setLoading(false);
      setValue(value);

      if (existing) {
        existing[cachePathname] = value;
        ScorecardModule.storeItem(storagePathname, JSON.stringify(existing));
      } else {
        ScorecardModule.storeItem(
          storagePathname,
          JSON.stringify({
            cachePathname: value,
          })
        );
      }
    });
  }, []);

  return [value, loading];
}
