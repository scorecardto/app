type Course = {
  courseName: string;
  average: string;
  otherFields: CourseFields;
};

type CourseFields = {
  [prop: string]: any;
};

export {Course, CourseFields};
