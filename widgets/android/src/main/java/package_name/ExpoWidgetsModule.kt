// TODO: get this to replace the existing ExpoWidgetsModule.kt file in @bittingz/expo-widgets

package expo.modules.widgets

import android.content.Context
import android.content.SharedPreferences
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoWidgetsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoWidgets")

    Function("setWidgetData") { json: String -> 
      //getPreferences().edit().putString("widgetdata", json).commit()
    }

    Function("getWidgetData") {
        return@Function ""
    }

    Function("getItem") { key: String ->
        return@Function ""
    }

    Function("storeItem") { key: String, value: String ->
        //getPreferences().edit().putString(key, value).commit()
    }
  }

  private val context
  get() = requireNotNull(appContext.reactContext)

  private fun getPreferences(): SharedPreferences {
    return context.getSharedPreferences(context.packageName + ".widgetdata", Context.MODE_PRIVATE)
  }
}