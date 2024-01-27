interface CourseState {
  average: string;
  categories: {
    name: string;
    assignments: {
      name: string;
      grade: string;
    }[];
  }[];
}

export default CourseState;
