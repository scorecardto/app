import ExpoModulesCore
import ActivityKit
import WidgetKit
import CommonCrypto

public class ExpoWidgetsModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ExpoWidgets")

        Function("getWidgetData") { () -> String in
            let widgetSuite = UserDefaults(suiteName: "group.com.scorecardgrades.mobile.expowidgets")
            if let data = widgetSuite?.data(forKey: "courses") {
                return String(decoding: data, as: UTF8.self)
            }
            return "[]"
        }

        Function("setWidgetData") { (json: String) in
            let widgetSuite = UserDefaults(suiteName: "group.com.scorecardgrades.mobile.expowidgets")
            widgetSuite?.set(json.data(using: .utf8)!, forKey: "courses")

            if #available(iOS 14.0, *) {
                WidgetCenter.shared.reloadAllTimelines()
            }
        }

        Function("getEnabledNotifs") { (json: String) -> String in
            let widgetSuite = UserDefaults(suiteName: "group.com.scorecardgrades.mobile.expowidgets")
            if let data = widgetSuite?.data(forKey: "notifs") {
                return String(decoding: data, as: UTF8.self)
            }
            return "{}"
        }

        Function("setEnabledNotifs") { (json: String) in
            let widgetSuite = UserDefaults(suiteName: "group.com.scorecardgrades.mobile.expowidgets")
            widgetSuite?.set(json.data(using: .utf8)!, forKey: "notifs")
        }

        Function("getItem") { (key: String) -> String? in
            let data = getItem(key)
            return data == nil ? nil : String(data: data!, encoding: .utf8)
        }

        Function("storeItem") { (key: String, item: String) in
            try storeItem(key, item.data(using: .utf8)!)
        }

        Function("clearStorage") { () in
            try clearStorage()
        }
    }
}
