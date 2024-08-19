import ExpoModule from "@bittingz/expo-widgets/src/ExpoWidgetsModule";

const ScorecardModule = {
    setWidgetData(json: string) {
        ExpoModule.setWidgetData(json);
    },
    getWidgetData(): string {
        return ExpoModule.getWidgetData();
    },
    storeItem(key: string, item: string) {
        ExpoModule.storeItem(key, item);
    },
    getItem(key: string): string {
        return ExpoModule.getItem(key);
    },
    clearStorage() {
        ExpoModule.clearStorage();
    }
}

export default ScorecardModule;