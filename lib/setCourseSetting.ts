// import { CourseSettings, DataProvider } from "scorecard-types";
// import { AppDispatch } from "../components/core/state/store";
// import { GradeData } from "../components/core/state/grades/gradeDataSlice";
// import * as courseSettingsSlice from "../components/core/state/grades/courseSettingsSlice";

// // this function is split specifically for hiding in CourseCard atm, but can be used
// // anywhere we want an animation before the context is updated
// // (storage should be updated immediately, but the context should be updated after the animation)
// export async function updateContextSettings(
//   dispatch: AppDispatch,
//   settings?: GradeData["courseSettings"]
// ) {}

// export function setCourseSetting(
//   dispatch: AppDispatch,
//   key: string,
//   courseSettings: CourseSettings,
//   updateContext?: boolean
// ) {
//   dispatch(
//     courseSettingsSlice.setCourseSetting({
//       key,
//       value: courseSettings,
//       save: true,
//     })
//   );
//   // const settings = {
//   //   ...allCourseSettings,
//   //   [key]: {
//   //     ...allCourseSettings[key],
//   //     ...courseSettings,
//   //   },
//   // };

//   // Storage.setItem({
//   //   key: "settings",
//   //   value: JSON.stringify(settings),
//   // });
//   // if (updateContext ?? true) updateContextSettings(dispatch, settings);
// }
