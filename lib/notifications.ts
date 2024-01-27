import {
  Assignment,
  Course,
  CourseSettings,
  GradebookNotification,
  GradebookRecord,
} from "scorecard-types";

function AorAn(count: string) {
  // if can be parsed as a number, use that
  if (!isNaN(parseInt(count))) {
    if (count.toString().startsWith("8")) {
      return "an";
    } else {
      return "a";
    }
  }
  // if starts with a vowel, use an
  else if (
    count.toLowerCase().startsWith("a") ||
    count.toLowerCase().startsWith("e") ||
    count.toLowerCase().startsWith("i") ||
    count.toLowerCase().startsWith("o") ||
    count.toLowerCase().startsWith("u")
  ) {
    return "an";
  }
  // otherwise use a
  else {
    return "a";
  }
}

function pluralize(count: number) {
  if (count === 1) {
    return "";
  } else {
    return "s";
  }
}

export function getNotifications(
  oldRecord: GradebookRecord,
  newRecord: GradebookRecord,
  courseSettings: { [key: string]: CourseSettings }
): GradebookNotification[] {
  const mutations = compareRecords(oldRecord, newRecord);
  const notifications: GradebookNotification[] = [];

  // map of mutations for every coursekey
  const courseMutations: Record<string, GradebookMutation[]> = {};
  const newRemovedCourseNotifications: Record<string, GradebookMutation[]> = {};

  mutations.forEach((mutation) => {
    if (mutation.courseKey) {
      if (!courseMutations[mutation.courseKey]) {
        courseMutations[mutation.courseKey] = [];
      }
      courseMutations[mutation.courseKey].push(mutation);
    } else if (mutation.subject === "course") {
      if (!newRemovedCourseNotifications[mutation.name!]) {
        newRemovedCourseNotifications[mutation.name!] = [];
      }
      newRemovedCourseNotifications[mutation.name!].push(mutation);
    }
  });

  // parse course mutations
  Object.keys(courseMutations).forEach((courseKey) => {
    const mutations: GradebookMutation[] = courseMutations[courseKey];
    const withValue: GradebookMutation[] = [];
    const withoutValue: GradebookMutation[] = [];

    let oldAverage = parseInt(mutations[0].oldAverage ?? "");
    let newAverage = parseInt(mutations[0].newAverage ?? "");
    let icon: GradebookNotification["icon"] =
      newAverage > oldAverage
        ? "RISE"
        : newAverage < oldAverage
        ? "FALL"
        : "NEUTRAL";

    const courseName =
      (mutations[0].courseKey &&
        courseSettings[mutations[0].courseKey]?.displayName) ??
      mutations[0].courseName ??
      "Unknown Course";

    mutations.forEach((mutation) => {
      if (mutation.grade && mutation.subject === "assignment") {
        withValue.push(mutation);
      } else if (mutation.subject === "assignment") {
        withoutValue.push(mutation);
      }
    });

    if (withValue.length === 1) {
      // one grade changed
      const grade = withValue[0].grade ?? "??";
      const assignmentName = withValue[0].name ?? "Unknown Assignment";

      notifications.push({
        icon,
        title: courseName,
        message:
          icon === "NEUTRAL"
            ? `You got ${AorAn(grade)} ${grade} on ${assignmentName}.`
            : `You got ${AorAn(
                grade
              )} ${grade} on ${assignmentName}, and your average ${
                icon === "RISE" ? "rose" : "dropped"
              } from ${oldAverage} to ${newAverage}.`,
        date: Date.now(),
        read: false,
        course: courseKey,
      });
    } else if (withValue.length > 1) {
      const gradeCount = withValue.length;

      notifications.push({
        icon,
        title: courseName,
        message:
          icon === "NEUTRAL"
            ? `You recieved ${gradeCount} new grades.`
            : `You got ${gradeCount} new grades, and your average ${
                icon === "RISE" ? "rose" : "dropped"
              } from ${oldAverage} to ${newAverage}.`,
        date: Date.now(),
        read: false,
        course: courseKey,
      });
    }

    if (withoutValue.length === 1) {
      const assignmentName = withoutValue[0].name ?? "Unknown Assignment";

      notifications.push({
        icon,
        title: courseName,
        message: `A new assignment was added without a grade: ${assignmentName}.`,
        date: Date.now(),
        read: false,
        course: courseKey,
      });
    } else if (withoutValue.length > 1) {
      const assignmentCount = withoutValue.length;

      notifications.push({
        icon,
        title: courseName,
        message: `${assignmentCount} new assignment${pluralize(
          assignmentCount
        )} were added without a grade.`,
        date: Date.now(),
        read: false,
        course: courseKey,
      });
    }
  });

  const updatedCourses = Object.keys(newRemovedCourseNotifications);

  if (updatedCourses.length === 1) {
    const courseName = updatedCourses[0];

    notifications.push({
      icon: "NEUTRAL",
      title: courseName,
      message:
        updatedCourses.length >= 1
          ? `This course was likely updated and some of your settings may have changed.`
          : `This course was likely ${
              newRemovedCourseNotifications[courseName][0].type === "add"
                ? "added"
                : "removed"
            } and some of your settings may have changed.`,
      date: Date.now(),
      read: false,
      course: newRemovedCourseNotifications[courseName][0].courseKey,
    });
  } else if (updatedCourses.length > 1) {
    notifications.push({
      icon: "NEUTRAL",
      title: "Multiple Courses",
      message: `${updatedCourses.length} courses were added, removed, or updated and some of your settings may have changed.`,
      date: Date.now(),
      read: false,
    });
  }
  return notifications;
}

interface GradebookMutation {
  type: "add" | "remove" | "update";
  subject: "course" | "assignmentCategory" | "assignment";
  name?: string;
  oldAverage?: string;
  newAverage?: string;
  grade?: string;
  courseKey?: string;
  courseName?: string;
}

function compareCourseLists(ref: {
  oldCourses: GradebookRecord["courses"];
  newCourses: GradebookRecord["courses"];
}): GradebookMutation[] {
  const mutations: GradebookMutation[] = [];

  ref.oldCourses.sort((a, b) => a.key.localeCompare(b.key));
  ref.newCourses.sort((a, b) => a.key.localeCompare(b.key));
  const { oldCourses, newCourses } = ref;

  const newNames: string[] = [];

  const newKeys = newCourses.map((c) => {
    newNames.push(c.name);
    return c.key;
  });

  const oldNames: string[] = [];

  const oldKeys = oldCourses.map((c) => {
    oldNames.push(c.name);
    return c.key;
  });

  const added = newKeys.filter((k, i) => {
    if (!oldKeys.includes(k)) {
      mutations.push({
        type: "add",
        subject: "course",
        name: newNames[i],
      });
      return true;
    }
    return false;
  });

  const removed = oldKeys.filter((k, i) => {
    if (!newKeys.includes(k)) {
      mutations.push({
        type: "remove",
        subject: "course",
        name: oldNames[i],
      });
      return true;
    }
    return false;
  });

  // remove courses from jNew that were added
  ref.newCourses = newCourses.filter((c) => !added.includes(c.key));

  // remove courses from jOld that were removed
  ref.oldCourses = oldCourses.filter((c) => !removed.includes(c.key));

  return mutations;
}

function compareAssignments(ref: {
  oldAssignments: Assignment[];
  newAssignments: Assignment[];
  oldAverage: string;
  newAverage: string;
  courseKey: string;
  courseName: string;
}): GradebookMutation[] {
  const mutations: GradebookMutation[] = [];

  const { oldAverage, newAverage, courseKey, courseName } = ref;
  const newAssignments = ref.newAssignments.map((a) => a.name);

  const oldAssignments = ref.oldAssignments.map((a) => a.name);

  const added = newAssignments.filter((a, idx) => {
    if (!oldAssignments.includes(a)) {
      mutations.push({
        type: "add",
        subject: "assignment",
        name: a,
        grade: ref.newAssignments[idx].grade,
        newAverage,
        oldAverage,
        courseKey,
        courseName,
      });
      return true;
    }
    return false;
  });

  const removed = oldAssignments.filter((a) => {
    if (!newAssignments.includes(a)) {
      mutations.push({
        type: "remove",
        subject: "assignment",
        name: a,
        newAverage,
        oldAverage,
        courseKey,
        courseName,
      });
      return true;
    }
    return false;
  });

  const newAssignmentsFiltered = ref.newAssignments.filter(
    (a) => !added.includes(a.name)
  );

  const oldAssignmentsFiltered = ref.oldAssignments.filter(
    (a) => !removed.includes(a.name)
  );

  newAssignmentsFiltered.sort(
    (a, b) => a.name?.localeCompare(b.name ?? "") ?? 0
  );
  oldAssignmentsFiltered.sort(
    (a, b) => a.name?.localeCompare(b.name ?? "") ?? 0
  );

  newAssignmentsFiltered.forEach((newAssignment, i) => {
    const oldAssignment = oldAssignmentsFiltered[i];

    if (newAssignment?.grade !== oldAssignment?.grade) {
      mutations.push({
        type: "update",
        subject: "assignment",
        name: newAssignment.name,
        grade: newAssignment.grade,
        newAverage,
        oldAverage,
        courseKey,
        courseName,
      });
    }
  });

  return mutations;
}

function compareAssignmentCategories(ref: {
  oldCategories: GradebookRecord["courses"][0]["gradeCategories"];
  newCategories: GradebookRecord["courses"][0]["gradeCategories"];
  oldAverage: string;
  newAverage: string;
  courseKey: string;
  courseName: string;
}): GradebookMutation[] {
  const mutations: GradebookMutation[] = [];

  ref.oldCategories?.sort((a, b) => a.name.localeCompare(b.name));
  ref.newCategories?.sort((a, b) => a.name.localeCompare(b.name));

  const {
    oldCategories,
    newCategories,
    oldAverage,
    newAverage,
    courseKey,
    courseName,
  } = ref;

  const newNames = newCategories?.map((c) => c.name) ?? [];
  const oldNames = newCategories?.map((c) => c.name) ?? [];

  const added = newNames.filter((name, idx) => {
    if (!oldNames.includes(name)) {
      mutations.push({
        type: "add",
        subject: "assignmentCategory",
        name,
        newAverage,
        oldAverage,
        courseKey,
        courseName,
      });
      mutations.push(
        ...compareAssignments({
          newAssignments: newCategories?.[idx].assignments ?? [],
          oldAssignments: [],
          newAverage,
          oldAverage,
          courseKey,
          courseName,
        })
      );
      return true;
    }
    return false;
  });

  const removed = oldNames.filter((name, idx) => {
    if (!newNames.includes(name)) {
      mutations.push({
        type: "remove",
        subject: "assignmentCategory",
        name,
        newAverage,
        oldAverage,
        courseKey,
        courseName,
      });
      mutations.push(
        ...compareAssignments({
          newAssignments: [],
          oldAssignments: oldCategories?.[idx].assignments ?? [],
          newAverage,
          oldAverage,
          courseKey,
          courseName,
        })
      );
      return true;
    }
    return false;
  });

  // remove categories from jNew that were added
  ref.newCategories = newCategories?.filter((c) => !added.includes(c.name));

  // remove categories from jOld that were removed
  ref.oldCategories = oldCategories?.filter((c) => !removed.includes(c.name));

  return mutations;
}

function compareRecords(
  oldRecord: GradebookRecord,
  newRecord: GradebookRecord
): GradebookMutation[] {
  const mutations: GradebookMutation[] = [];

  const oldCourses = oldRecord.courses;
  const newCourses = newRecord.courses;

  mutations.push(
    ...compareCourseLists({
      oldCourses,
      newCourses,
    })
  );

  for (let i = 0; i < oldCourses.length; i++) {
    const oldCourse = oldCourses[i];
    const newCourse = newCourses[i];

    const newAverage =
      newCourse.grades[newCourse.grades.filter((g) => g).length - 1]?.value ??
      "";
    const oldAverage =
      oldCourse.grades[oldCourse.grades.filter((g) => g).length - 1]?.value ??
      "";

    const oldCategories = oldCourse.gradeCategories;
    const newCategories = newCourse.gradeCategories;

    mutations.push(
      ...compareAssignmentCategories({
        oldCategories,
        newCategories,
        newAverage,
        oldAverage,
        courseKey: newCourse.key,
        courseName: newCourse.name,
      })
    );

    newCategories?.forEach((newAssignmentCategory, i) => {
      const oldAssignmentCategory = oldCategories?.[i];

      mutations.push(
        ...compareAssignments({
          newAssignments: newAssignmentCategory.assignments ?? [],
          oldAssignments: oldAssignmentCategory?.assignments ?? [],
          newAverage,
          oldAverage,
          courseKey: newCourse.key,
          courseName: newCourse.name,
        })
      );
    });
  }

  return mutations;
}
