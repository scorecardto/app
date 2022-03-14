type Course = {
  courseName: string;
  average: string;
  otherFields: {
    [prop: string]: any;
  };
};

type Assignment = {
  name: string;
  grade: string;
  weight: number;
  otherFields: {
    [prop: string]: any;
  };
};
export {Course, Assignment};
