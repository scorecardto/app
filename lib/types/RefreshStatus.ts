import {CourseResponse} from "scorecard-types";

export default interface RefreshStatus {
  tasksCompleted: number;
  taskRemaining: number;
  status: string;
  type: "IDLE" | "LOGGING_IN" | "GETTING_COURSES";
  courseKey?: string;
  reportCard?: CourseResponse;
}
