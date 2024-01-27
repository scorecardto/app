import { Course } from "scorecard-types";
import CourseState from "./types/CourseState";

export default function captureCourseState(c: Course): CourseState {
  return {
    average: c.grades[c.grades.length - 1]?.value ?? "NG",
    categories:
      c.gradeCategories?.map((category) => ({
        name: category.name,
        assignments:
          category.assignments?.map((assignment) => ({
            name: assignment.name ?? "No Name",
            grade: assignment.grade ?? "NG",
          })) ?? [],
      })) ?? [],
  };
}
