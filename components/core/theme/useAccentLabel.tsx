import { useContext } from "react";
import { CurrentCourseContext } from "../context/CurrentCourseContext";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import color from "../../../lib/Color";
function useAccentLabel() {
  const currentCourse = useContext(CurrentCourseContext);

  const defaultLabel = color.defaultAccentLabel;

  const accentLabel = useSelector((state: RootState) => {
    if (currentCourse.key) {
      return state.courseSettings[currentCourse.key]?.accentColor;
    }
    return null;
  });

  return accentLabel || defaultLabel;
}

export default useAccentLabel;
