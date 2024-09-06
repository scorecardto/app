import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../core/state/store";
import {AppState} from "react-native";
import {updateCourseIfPinned} from "../core/state/widget/widgetSlice";
import {useEffect} from "react";

export default function AppStateListener() {
    const dispatch = useDispatch();

    const courses = useSelector((state: RootState) => state.gradeData.record?.courses ?? []);
    const gradeCategory = useSelector((state: RootState) => state.gradeData.record?.gradeCategory ?? 0);

    useEffect(() => AppState.addEventListener("change", state => {
        if (state !== 'active') return;

        for (const course of courses) {
            dispatch(updateCourseIfPinned({
                key: course.key,
                grade: course.grades[gradeCategory]?.value ?? "NG",
            }));
        }
    }).remove, []);

    return undefined;
}