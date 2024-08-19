package com.scorecardgrades.mobile

import android.appwidget.*
import android.content.*
import android.widget.RemoteViews
import android.content.SharedPreferences
import java.util.logging.Logger
import org.json.*
import android.view.View
import android.graphics.Color;
import android.content.res.ColorStateList
import android.util.TypedValue

public val IS_WIDGET_UPDATE ="isWidgetUpdate";

/**
 * Implementation of App Widget functionality.
 */
class SampleWidget : AppWidgetProvider() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.hasExtra(IS_WIDGET_UPDATE)) {
            this.onUpdate(context, AppWidgetManager.getInstance(context),
                AppWidgetManager.getInstance(context).getAppWidgetIds(ComponentName(context, SampleWidget::class.java)));
        } else super.onReceive(context, intent)
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        // There may be multiple widgets active, so update all of them
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onEnabled(context: Context) {
        // Enter relevant functionality for when the first widget is created
    }

    override fun onDisabled(context: Context) {
        // Enter relevant functionality for when the last widget is disabled
    }
}

 fun updateAppWidget(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetId: Int
) {
    val data = JSONArray(context.getSharedPreferences("${context.packageName}.widgetdata", Context.MODE_PRIVATE)
                    .getString("widgetdata", "{}"));

    val views = RemoteViews(context.packageName, com.scorecardgrades.mobile.R.layout.sample_widget)

    for (i in 0..2) {
        try {
            val courseData = if (i < data.length()) data.getJSONObject(i) else null;

            val nameView = R.id::class.java.getField("slot${i+1}_name").getInt(null);
            views.setTextViewText(nameView, courseData?.getString("title") ?: "Course slot ${i+1}")
            views.setTextViewTextSize(nameView, TypedValue.COMPLEX_UNIT_DIP, if (courseData != null) 15f else 13f)
            views.setTextColor(nameView, Color.parseColor(if (courseData != null) "#000000" else "#c9c9c9"))

            val gradeView = R.id::class.java.getField("slot${i+1}_grade").getInt(null);
            views.setTextViewText(gradeView, courseData?.getString("grade") ?: "")
            views.setViewVisibility(gradeView, if (courseData != null) View.VISIBLE else View.INVISIBLE)

            views.setColorStateList(gradeView, "setBackgroundTintList", ColorStateList.valueOf(
                Color.parseColor(courseData?.getString("color") ?: "#000000")))
        } catch (e: JSONException) {
            continue;
        }
    }

    appWidgetManager.updateAppWidget(appWidgetId, views)
}
