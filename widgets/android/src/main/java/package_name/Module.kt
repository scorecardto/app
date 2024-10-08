package expo.modules.widgets

import com.scorecardgrades.mobile.*

import android.appwidget.*
import android.content.Intent
import android.content.ComponentName
import android.content.Context
import android.content.SharedPreferences
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoWidgetsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoWidgets")

    Function("setWidgetData") { json: String -> 
      getPreferences().edit().putString("widgetdata", json).commit()

      val updateIntent = Intent();
      updateIntent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
      updateIntent.putExtra("isWidgetUpdate", true);
      context.sendBroadcast(updateIntent);
    }

    Function("getWidgetData") {
        return@Function getPreferences().getString("widgetdata", null)
    }

    Function("getItem") { key: String ->
        return@Function getItem(dir, key)
    }

    Function("storeItem") { key: String, value: String ->
        storeItem(dir, key, value)
    }

    Function("clearStorage") {
        clearStorage(dir)
    }
  }

  private val dir
    get() = context.getDir("storage", Context.MODE_PRIVATE)

  private val context
    get() = requireNotNull(appContext.reactContext)

  private fun getPreferences(): SharedPreferences {
    return context.getSharedPreferences(context.packageName + ".widgetdata", Context.MODE_PRIVATE)
  }
}