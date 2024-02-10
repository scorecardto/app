import React, { useMemo } from "react";
import CurrentCourseProvider from "../../core/context/CurrentCourseProvider";

export default function CourseScreenWrapper(props: {
  courseKey: string;
  children: React.ReactNode;
}) {
  const children = useMemo(() => props.children, []);

  return (
    <CurrentCourseProvider courseKey={props.courseKey}>
      {children}
    </CurrentCourseProvider>
  );
}
