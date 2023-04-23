import { Course } from "scorecard-types";

export function formatCourseFromAssignmentPoints(
  course: Course,
  gradingPeriod: number
) {
  const withPercentagesFixed = {
    ...course,
    gradeCategories: course.gradeCategories.map((category) => {
      return {
        ...category,
        assignments: category.assignments.map((assignment) => {
          if (assignment.points != null && assignment.max != null) {
            return {
              ...assignment,
              grade: `${(assignment.points / assignment.max) * 100}%`,
            };
          } else {
            return assignment;
          }
        }),
      };
    }),
  };

  const withCategoryAverages = {
    ...withPercentagesFixed,
    gradeCategories: withPercentagesFixed.gradeCategories.map((category) => {
      let sum = 0;
      let count = 0;

      category.assignments.forEach((assignment) => {
        let def = assignment.grade?.replace("%", "").toLowerCase();
        let weight = assignment.count ?? 1;

        if (assignment.dropped) return;

        if (def) {
          const exact =
            assignment.points && assignment.scale
              ? (assignment.points / assignment.scale) * 100
              : undefined;

          if (def === "msg") def = "0";
          if (def.match(/[a-z]/g)) return;

          sum += (exact ?? parseFloat(def)) * weight;
          count += weight;
        }
      });

      return {
        ...category,
        average: Math.round(sum / count),
      };
    }),
  };

  let sum = 0;
  let count = 0;

  withCategoryAverages.gradeCategories.forEach((category) => {
    let weight = category.weight ?? 1;

    if (category.average == null) return;

    sum += category.average * weight;
    count += weight;
  });

  const returnable = {
    ...withCategoryAverages,
  };

  returnable.grades[gradingPeriod].value = `${Math.round(sum / count)}`;

  return returnable;
}
