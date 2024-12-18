import WidgetKit
import SwiftUI

func getEntry() -> CourseGradeEntry {
  let widgetSuite = UserDefaults(suiteName: "group.com.scorecardgrades.mobile.expowidgets")!

  var courses: [CourseData] = []
  if let data = widgetSuite.data(forKey: "courses") {
    do {
      courses = try JSONDecoder().decode([CourseData].self, from: data)
    } catch (_) {}
  }

  let time = Double(Date().timeIntervalSince1970); // in seconds
  do {
    var recordData =  getItem("records")
    let loginData = getItem("login")

    let recordString = recordData == nil ? nil : String(data: recordData!, encoding: .utf8)!
    let lastFetch = recordString == nil ? nil : Double((recordString as? NSString)!.substring(with: try NSRegularExpression(pattern: "\"date\": ?([0-9]*)").firstMatch(in: recordString!, range: NSMakeRange(0, recordString!.count))!.range(at: 1)))
    if ((lastFetch == nil || time-lastFetch!/1000 >= 3600) && loginData != nil) {
      let login = try JSONSerialization.jsonObject(with: loginData!) as! [String:String]

      let firstCourses = recordString == nil ? nil : try /{.*?}(?=,{\"(courses|date|gradeCategoryNames|gradeCategory)\":)/.firstMatch(in: recordString!)?.range
      let oldRecord = firstCourses == nil ? nil : try JSONDecoder().decode(GradebookRecord.self, from: recordString![firstCourses!].data(using: .utf8)!)

      let content = try fetchAllContent(login["host"]!, oldRecord?.courses.count, login["username"]!, login["password"]!, oldRecord?.gradeCategory)

      let gradeCategory = max(content.courses.map({c in c.grades.filter({g in g != nil}).count}).max()! - 1, 0)

      if (recordData == nil) {
        recordData = "[]".data(using: .utf8)
      } else {
        recordData!.insert(contentsOf: ",".data(using: .utf8)!, at: 1)

      }
      recordData!.insert(contentsOf: try JSONEncoder().encode(GradebookRecord(gradeCategoryNames: content.gradeCategoryNames, date: time*1000, courses: content.courses, gradeCategory: gradeCategory)), at: 1)

      for i in courses.indices {
        let data = courses[i]

        for course in content.courses {
          if (data.key == course.key) {
            courses[i].grade = course.grades[gradeCategory]?.value ?? data.grade
          }
        }
      }

      try widgetSuite.set(JSONEncoder().encode(courses), forKey: "courses")

      try storeItem("records", recordData!)

      if (oldRecord != nil) {
        var changedCourses: [Course] = []

        let courseSettingsData = getItem("courseSettings")
        let courseSettings = courseSettingsData == nil ? [:] : try JSONDecoder().decode([String:CourseSettings].self, from: courseSettingsData!)

        let assignmentHasGrade = {(a: Assignment?) in try a?.grade != nil && !a!.grade!.isEmpty && /[^a-z]/.firstMatch(in: a!.grade!.lowercased()) != nil};
        let getCourseName = {(c: Course) in courseSettings[c.key]?.displayName ?? c.name}

        courseLoop:
        for course in content.courses {
          if (courseSettings[course.key]?.hidden == true) {
            continue;
          }

          let oldCourse = oldRecord!.courses.first(where: {c in c.key == course.key});
          if (oldCourse == nil) {
            continue;
          }

          let handleChanged = {() in
            changedCourses.append(course)
          }

          if (course.grades[gradeCategory]?.value != oldCourse!.grades[gradeCategory]?.value) {
            handleChanged()
            continue courseLoop
          }

          for category in course.gradeCategories! {
            let oldCategory = oldCourse!.gradeCategories!.first(where: {c in c.name == category.name});

            if (category.average != oldCategory?.average) {
              handleChanged()
              continue courseLoop
            }

            for assignment in category.assignments! {
              if (assignment.name == nil || assignment.name!.isEmpty) {
                continue;
              }
              let oldAssignment = oldCategory?.assignments?.first(where: {a in a.name == assignment.name});

              if (try assignmentHasGrade(assignment)) {
                if (!(try assignmentHasGrade(oldAssignment))) {
                  handleChanged()
                  continue courseLoop
                }
              }
            }
          }
        }

        let notif = UNMutableNotificationContent()
        notif.sound = .default

        var dontSend = false
        if (changedCourses.count == 1) {
          notif.title = getCourseName(changedCourses[0])
          notif.body = "New grades are available. Tap to go to your Scorecard."
          notif.userInfo = ["course": changedCourses[0].key]
        } else if (changedCourses.count > 1) {
          notif.title = "New Grades"
          notif.body = "\(changedCourses.count) courses have been updated. Tap to go to your Scorecard."
        } else {
          dontSend = true
        }

        if (!dontSend) {
            UNUserNotificationCenter.current().add(UNNotificationRequest(identifier: UUID().uuidString, content: notif, trigger: UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)))
        }
      }
    }
  } catch (_) {}

  for i in 1...3 {
    if (i <= courses.count) {
      continue
    }

    courses.append(CourseData(key: "\(i)", title: "Course slot \(i)", grade: "", color: ""))
  }

  return CourseGradeEntry(
    date: .now,
    courses: courses
  )
}

func getColor(_ hex: Int) -> Color {
  return Color(red: Double((hex & 0xff0000) >> 16)/255.0, green: Double((hex & 0xff00) >> 8)/255.0, blue: Double(hex & 0xff)/255.0)
}

func getColor(_ hex: String) -> Color {
  return getColor(Int(hex.replacingOccurrences(of: "#", with: ""), radix:16)!)
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
        let nextUpdateDate = Calendar.current.date(byAdding: .minute, value: 60, to: date)!
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
    let view = GeometryReader { metrics in
      VStack {
        HStack {
          Image("AppIcon")
            .resizable()
            .padding(.leading, 12)
            .padding(.vertical, 6)
            .aspectRatio(1, contentMode: .fit)
          Spacer()
        }
        .frame(width: metrics.size.width, height: metrics.size.height/3)
        .background(LinearGradient(colors: [getColor(0x4DA0D3), getColor(0x1779B8)], startPoint: .leading, endPoint: .trailing))
        VStack {
          ForEach(entry.courses, id: \.key) { (course: CourseData) in
              HStack {
                VStack(alignment: .leading) {
                  // set size with truncated text, but actually display non truncated text to have the fade rather than ellipsis
                  //                ZStack {
                  Text(course.title)
                    .frame(height: NSString(" ").size(withAttributes: [.font: UIFont.monospacedSystemFont(ofSize: 12, weight: .regular)]).height)
                    .font(.system(size: course.grade == "" ? 12 : 13.5, design: .rounded))
                    .lineLimit(1)
                    .foregroundStyle(course.grade == "" ? Color.gray : Color.black)
                  //                    .frame(width: 30/*metrics.size.width-8-8-4-9-9-gradeWidth*/)
                  //                    .fixedSize()
                  //                    .clipped()
                  //                    .foregroundStyle(LinearGradient(colors: [Color.black, Color.clear], startPoint: UnitPoint(x: 0.85, y: 0), endPoint: .trailing))

                  //                  Text(course.title)
                  //                    .font(.system(size: 12, design: .rounded))
                  //                    .lineLimit(1)
                  //                }
                  Divider()
                    .padding(.top, -3)
                }.lineLimit(1)
                Spacer()
                Text(course.grade)
                  .font(.system(size: 12.5, weight: .bold, design: .monospaced))
                  .frame(width: NSString("888").size(withAttributes: [.font: UIFont.monospacedSystemFont(ofSize: 12.5, weight: .bold)]).width)
                  .padding(.vertical, 3)
                  .padding(.horizontal, 9)
                  .background(course.grade == "" ? Color.clear : getColor(course.color))
                  .clipShape(RoundedRectangle(cornerRadius: 10))
                  .clipped()
                  .foregroundStyle(Color.white)
                  .offset(y: -3)
              }.padding(.leading, 14).padding(.trailing, 8)
              Spacer()
            }
          }.padding(.top, 1)
        Spacer()
        }
      }.background(getColor(0xEBF5FF))

      if #available(iOSApplicationExtension 17.0, *) {
        view.containerBackground(.clear, for: .widget)
      } else {
        view
      }
    }
}

struct CourseGradeWidget: Widget {
    let kind: String = "CourseGradeWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            CourseGradeEntryView(entry: entry)
        }
        .contentMarginsDisabled()
        .configurationDisplayName("Scorecard")
        .description("Display up to three pinned courses on your home screen.")
        .supportedFamilies([.systemSmall])
    }
}

@available(iOSApplicationExtension 17.0, *)
#Preview(as: .systemSmall) {
  CourseGradeWidget()
} timeline: {
  getEntry()
}

struct MyWidget_Previews: PreviewProvider {
    static var previews: some View {

      CourseGradeEntryView(entry: getEntry())
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
