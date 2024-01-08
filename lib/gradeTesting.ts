import { Assignment, Course, GradeCategory } from "scorecard-types";

export function averageAssignments(
  categories: GradeCategory[],
  modifiedAssignments: ((Assignment|null)[] | null)[]
) {
  return categories.map((category, i) => {
    let sum = 0;
    let count = 0;

    (modifiedAssignments[i] ?? category.assignments)?.forEach(
      (assignment, i) => {
        if (assignment == null && category.assignments?.[i] != null) {
          assignment = category.assignments[i];
        }
        if (assignment == null) return;

        let def = assignment.grade?.replace("%", "").toLowerCase();
        let weight = assignment.count ?? 1;

        if (assignment.dropped) return;

        if (def) {
          const exact =
            assignment.points && assignment.max
              ? (assignment.points / assignment.max) * 100
              : undefined;

          if (def === "msg") def = "0";
          if (def.match(/[a-z]/g)) return;

          sum += (exact ?? parseFloat(def)) * weight;
          count += weight;
        }
      }
    );

    return Math.round(sum / count);
  });
}

export function averageGradeCategories(categories: GradeCategory[]) {
  let sum = 0;
  let count = 0;

  categories.forEach((category) => {
    let weight = category.weight ?? 100;

    if (category.average == null || category.average === "") return;

    sum += parseInt(category.average) * weight;
    count += weight;
  });

  return Math.round(sum / count);
}
