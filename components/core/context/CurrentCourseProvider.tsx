import React from "react";
import { CurrentCourseContext } from "./CurrentCourseContext";
export default function CurrentCourseProvider(props: {
  courseKey: string;
  children: React.ReactNode;
}) {
  return (
    <CurrentCourseContext.Provider
      value={{
        key: props.courseKey,
      }}
    >
      {props.children}
    </CurrentCourseContext.Provider>
  );
}
