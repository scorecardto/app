import React, { useMemo } from "react";
import CurrentCourseProvider from "../../core/context/CurrentCourseProvider";

export default function CourseScreenWrapper(props: {
  courseKey: string;
  children: React.ReactNode;
}) {
  return (
    <CurrentCourseProvider courseKey={props.courseKey}>
      {props.children}
    </CurrentCourseProvider>
  );
}
