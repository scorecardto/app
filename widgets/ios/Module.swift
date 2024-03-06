import ExpoModulesCore
import ActivityKit
import WidgetKit

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
    }
}
