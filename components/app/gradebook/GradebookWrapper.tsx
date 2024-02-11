import { View, Text, Animated } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Course } from "scorecard-types";
import Gradebook from "./Gradebook";

export default function GradebookWrapper(props: {
  course: Course;
  setModifiedGrade(avg: string | null): void;
}) {
  const [show, setShow] = useState(false);

  const opacityAnimation = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setShow(true);
    }, 10);
  }, []);
  return (
    <Animated.View
      style={{
        opacity: opacityAnimation,
      }}
    >
      {show && (
        <Gradebook
          course={props.course}
          setModifiedGrade={props.setModifiedGrade}
        />
      )}
    </Animated.View>
  );
}
