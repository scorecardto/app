import React from "react";

export const CurrentCourseContext = React.createContext<CurrentCourse>({
  key: "",
});

export interface CurrentCourse {
  key: string;
}
