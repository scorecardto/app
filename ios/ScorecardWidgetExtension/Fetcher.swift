import Foundation
import SwiftSoup

func entryPoint(_ host: String) async throws -> String {
  let request = URLRequest(url: URL(string: "https://\(host)/selfserve/EntryPointHomeAction.do?parent=false")!)
  let (_, response) = try await URLSession.shared.data(for: request);
  
  let cookie = (response as! HTTPURLResponse).allHeaderFields["Set-Cookie"] as! String;
  return cookie.split(separator:/, (?=[a-z_0-9A-Z]*?=)/).map{ $0.split(separator:";")[0] }.joined(separator:"; ")
}

func login(_ host: String, _ cookies: String, _ username: String, _ password: String) async throws {
  var request = URLRequest(url: URL(string: "https://\(host)/selfserve/SignOnLoginAction.do")!)
  request.httpMethod = "POST"
  request.setValue(cookies, forHTTPHeaderField: "Cookie")
  request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
  request.httpBody = "userLoginId=\(username)&userPassword=\(password)".data(using: .utf8)
  
  let (data, response) = try await URLSession.shared.data(for: request);
  let parsed = try SwiftSoup.parse(String(decoding: data, as: UTF8.self));
  
  let error = try parsed.select("span.error").first()?.text()
  if (error == "User ID or Password is incorrect.") {
    throw "INCORRECT_PASSWORD"
  } else if (error == "The username or password you entered is invalid.  Please try again." || error == "Invalid User ID or Password! ") {
    throw "INCORRECT_USERNAME"
  }
}

func parseHome(_ host: String, _ cookies: String) async throws -> ([Course], [String]) {
  var request = URLRequest(url: URL(string: "https://\(host)/selfserve/PSSViewReportCardsAction.do?x-tab-id=undefined")!)
  request.httpMethod = "POST"
  request.setValue(cookies, forHTTPHeaderField: "Cookie")
  
  let (data, response) = try await URLSession.shared.data(for: request);
  let parsed = try SwiftSoup.parse(String(decoding: data, as: UTF8.self));
  
  if (try parsed.select("#pageMessageDiv .message .info").first()?.text() == "Your session has expired. Please use the Close button and log in again.") {
      throw "SESSION_EXPIRED"
  }
  
  let courseElements = try parsed.select(".studentGradingBottomLeft tr:not(:first-child) td:nth-child(4)")
    
  var columnNames: [String] = []
  var courses: [Course] = []
  
  for (idx, courseElement) in courseElements.enumerated() {
    let courseKey = try courseElement.attr("cellkey")
    let name = try courseElement.text()
    
    var grades: [CourseGrade?] = []
    
    for gradeElement in try parsed.select(".studentGradingBottomRight tr:nth-child(\(idx + 2)) td") {
      let key = try gradeElement.attr("cellkey")
      
      let parsedKey = key.split(separator: ",").reduce(into: [:] as [String:String], {(res, str) in res[String(str.split(separator: "=")[0])] = String(str.split(separator: "=")[1])});
      
      if (idx == 0) {
        columnNames.append(parsedKey["gradeTypeIndex"] ?? "Grading Period")
      }
      
      let grade = parsedKey["gradeIndex"]
      if (grade != nil && !grade!.isEmpty) {
        grades.append(CourseGrade(value: grade!, key: key, active: !(try gradeElement.select("font").isEmpty())))
      } else {
        grades.append(nil)
      }
    }
    
    courses.append(Course(key: courseKey, name: name, grades: grades))
  }
  
  return (courses, columnNames)
}

func parseCourse(_ host: String, _ cookies: String, _ courseKey: String) async throws -> [GradeCategory] {
  var request = URLRequest(url: URL(string: "https://\(host)/selfserve/PSSViewGradeBookEntriesAction.do?x-tab-id=undefined")!)
  request.httpMethod = "POST"
  request.setValue(cookies, forHTTPHeaderField: "Cookie")
  request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
  request.httpBody = "gradeBookKey=\(courseKey)".data(using: .utf8)
  
  let (data, response) = try await URLSession.shared.data(for: request);
  let parsed = try SwiftSoup.parse(String(decoding: data, as: UTF8.self));

  return try parsed.select(".tablePanelContainer").map { c in
    var categoryDetailElements = try c.select(".sst-title").html().split(separator:"<br />")
        
    var error = false
    var weight = 0.0
    
    let averageSplit = categoryDetailElements[1].split(separator: " ", maxSplits: 1)
    let average = averageSplit.count < 2 ? "" : averageSplit[1]
    
    let parsedWeight = Double(categoryDetailElements[2].split(separator: " ", maxSplits: 1)[1])
    if (parsedWeight == nil) {
      error = true
    } else {
      weight = parsedWeight!
    }
    
    let headers = try c.select(".frozen-row").first()!;
    
    let getHeaderPosition = {(name: String) in
      try headers.select("th").firstIndex(where: {e in try e.attr("columnid") == name})!
    }
    
    let nameIndex = try getHeaderPosition("Assignment Name")
    let gradeIndex = try getHeaderPosition("Grade Value")
    let droppedIndex = try getHeaderPosition("droppedIndicator")
    let assignIndex = try getHeaderPosition("Assign Date")
    let dueDateIndex = try getHeaderPosition("Due Date")
    let scaleIndex = try getHeaderPosition("Grade Scale")
    let valueIndex = try getHeaderPosition("Maximum Value")
    let countIndex = try getHeaderPosition("Count")
    let noteIndex = try getHeaderPosition("Note")
    
    var assignments: [Assignment] = []
    
    for a in try c.select("tbody.tblBody > tr") {
      let elementList = a.children()
      let error = false
      
      let name = try elementList[nameIndex].text()
      
      
      let gradeText = try elementList[gradeIndex].text().trimmingCharacters(in: CharacterSet.whitespaces)
      
      let points = !gradeText.contains("(") ? 0 : Double(gradeText.split(separator:"(")[0]) ?? 0
      let grade = !gradeText.contains("(") ? gradeText : String(gradeText
        .split(separator:"(")[1]
        .split(separator:")")[0]
        .replacing(/\.0?%/, with: "%"))
      
      let dropped = try !elementList[droppedIndex].text().trimmingCharacters(in: CharacterSet.whitespaces).isEmpty
      let assign = try elementList[assignIndex].text()
      let due = try elementList[dueDateIndex].text()
      let scale = Double(try elementList[scaleIndex].text())!
      let max = Double(try elementList[valueIndex].text())!
      let count = Double(try elementList[countIndex].text())!
      let note = try elementList[noteIndex].text()
      
      assignments.append(Assignment(name: name, points: points, grade: grade, dropped: dropped, assign: assign, due: due, scale: scale, max: max, count: count, note: note, error: error))
    }
    
    return GradeCategory(name: String(categoryDetailElements[0]), id: c.id().replacing("panelContainer", with: ""), average: String(average), weight: weight, error: error, assignments: assignments)
  }
}

func fetchCourse(_ host: String, _ username: String, _ password: String, _ courseIdx: Int, courseInfoCallback: ((_ num: Int, _ names: [String]) -> Void)?=nil) async throws -> Course? {
  let cookies = try await entryPoint(host)
  try await login(host, cookies, username, password)
  
  let (courses, gradeCategoryNames) = try await parseHome(host, cookies)
  courseInfoCallback?(courses.count, gradeCategoryNames)
  
  if (courses.count <= courseIdx) {
    return nil
  }
  
  let course = courses[courseIdx];
  
  return Course(key: course.key, name: course.name, grades: course.grades, gradeCategories: try await parseCourse(host, cookies, course.key))
}

struct AllContent {
  var courses: [Course]
  var gradeCategoryNames: [String]
}

func fetchAllContent(_ host: String, _ oldNumCourses: Int?, _ username: String, _ password: String) throws -> AllContent {
  var numCourses = (oldNumCourses == 0 ? nil : oldNumCourses) ?? 8
  
  var courses: [Course?] = []
  var resolved: [Int] = []
  var gradeCategoryNames: [String] = []
  
  let serialQueue = DispatchQueue(label: "queuename")
  

  func runCourse(_ i: Int) {
    courses.append(nil)
    Task {
      let names: [String] = []
      
      var course = try await fetchCourse(host, username, password, i, courseInfoCallback: {(realNum: Int, names: [String]) in
        serialQueue.sync {
          if (realNum > numCourses) {
            for i in numCourses...realNum {
              runCourse(i);
            }
          }
          
          numCourses = realNum;
          gradeCategoryNames = names
        }
      })
      if (course != nil) {
        serialQueue.sync {
          resolved.append(i)
          courses[i] = course!
        }
      }
    }
  }
  
  for i in 0...numCourses {
    runCourse(i)
  }

  while (resolved.count < numCourses) {
    usleep(50000)
  }
  
  return AllContent(courses: courses.filter({c in c != nil}).map({c in c!}), gradeCategoryNames: gradeCategoryNames)
}
