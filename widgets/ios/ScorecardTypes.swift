struct CourseSettings: Codable {
  var displayName: String?
  var lastUpdated: Double?
  var hidden: Bool?
  var accentColor: String?
  var glyph: String?
}

struct GradebookRecord: Codable {
  var gradeCategoryNames: [String]
  var date: Double
  var courses: [Course]
  var gradeCategory: Int?
}

struct Course: Codable {
  var key: String
  var name: String
  var grades: [CourseGrade?]
  var gradeCategories: [GradeCategory]?
}

struct CourseGrade: Codable {
  var value: String
  var key: String
  var active: Bool
}

struct GradeCategory: Codable {
  var name: String
  var id: String
  var average: String
  var weight: Double
  var error: Bool
  var assignments: [Assignment]?
}

struct Assignment: Codable {
  var name: String?
  var points: Double?
  var grade: String?
  var dropped: Bool
  var assign: String?
  var due: String?
  var scale: Double?
  var max: Double?
  var count: Double?
  var note: String?
  var error: Bool
}

struct CourseData: Codable {
    var key: String
    var title: String
    var grade: String
    var color: String
}
