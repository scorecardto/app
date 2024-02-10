import React, { Dispatch, SetStateAction } from "react";
import { GradebookNotification, GradebookRecord } from "scorecard-types";
import UserRank from "../../../lib/types/UserRank";
import CourseStateRecord from "../../../lib/types/CourseStateRecord";
import RefreshStatus from "../../../lib/types/RefreshStatus";

export const MobileDataContext = React.createContext<MobileData>({
  confirmPhoneNumberCallback: async () => {},
  setConfirmPhoneNumberCallback: () => {},
  userRank: "DEFAULT",
  setUserRank: () => {},
  oldCourseStates: {},
  setOldCourseStates: () => {},
  refreshStatus: {
    status: "No Data to Load",
    taskRemaining: 0,
    tasksCompleted: 0,
    type: "IDLE",
  },
  setRefreshStatus: () => {},
  invitedNumbers: null,
  setInvitedNumbers: () => {},
});

export interface MobileData {
  confirmPhoneNumberCallback: (code: string) => Promise<any>;
  setConfirmPhoneNumberCallback: React.SetStateAction<any>;
  userRank: UserRank;
  setUserRank: Dispatch<SetStateAction<UserRank>>;
  oldCourseStates: CourseStateRecord;
  setOldCourseStates: Dispatch<SetStateAction<CourseStateRecord>>;
  refreshStatus: RefreshStatus;
  setRefreshStatus: Dispatch<SetStateAction<RefreshStatus>>;
  invitedNumbers: string[] | null;
  setInvitedNumbers: Dispatch<SetStateAction<string[] | null>>;
}
