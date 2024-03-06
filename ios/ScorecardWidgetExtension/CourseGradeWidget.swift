import WidgetKit
import SwiftUI

func getEntry() -> CourseGradeEntry {
    let widgetSuite = UserDefaults(suiteName: "group.com.scorecardgrades.mobile.expowidgets")

    var courses: [CourseData] = []
    if let data = widgetSuite?.data(forKey: "courses") {
        let decoder = JSONDecoder()
      do {
        courses = try decoder.decode([CourseData].self, from: data)
      } catch (let err) {
        courses = [CourseData(key: "err", title: "ERROR", grade: err.localizedDescription)]
      }
    }

    return CourseGradeEntry(
      date: Date(),
      courses: courses
    )
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> CourseGradeEntry {
        getEntry()
    }

    func getSnapshot(in context: Context, completion: @escaping (CourseGradeEntry) -> ()) {
        let entry = getEntry()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let date = Date()
        let entry = getEntry()
        let nextUpdateDate = Calendar.current.date(byAdding: .minute, value: 15, to: date)!
        let timeline = Timeline(
            entries: [ entry ],
            policy: .after(nextUpdateDate)
        )
        completion(timeline)
    }
}

struct CourseGradeEntry: TimelineEntry {
    let date: Date
    let courses: [CourseData]
}

struct CourseGradeEntryView : View {
  var entry: Provider.Entry

  var body: some View {
      let stack = VStack(alignment: .leading) {
        ForEach(entry.courses, id: \.key) { course in
          HStack {
            Text(course.title)
            Text("\(course.grade)")
          }
        }
        if (entry.courses.count == 0) {
          Text("Pin up to 3 courses in Scorecard!")
        }
      }
      if #available(iOSApplicationExtension 17.0, *) {
        stack.containerBackground(.clear, for: .widget)
      } else {
        stack
      }
    }
}

struct CourseGradeWidget: Widget {
    let kind: String = "CourseGradeWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            CourseGradeEntryView(entry: entry)
        }
        .configurationDisplayName("Pinned Courses")
        .description("Show up to three pinned courses on your home screen.")
    }
}

@available(iOSApplicationExtension 17.0, *)
#Preview(as: .systemSmall) {
  CourseGradeWidget()
} timeline: {
  CourseGradeEntry(date: .now, courses: [])
}

struct MyWidget_Previews: PreviewProvider {
    static var previews: some View {

      CourseGradeEntryView(entry: CourseGradeEntry(date: .now, courses: []))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
