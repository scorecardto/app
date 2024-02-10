import { View, Text } from "react-native";
import React, { useMemo, useState } from "react";
import { MobileDataContext, MobileData } from "./MobileDataContext";
import { GradebookNotification } from "scorecard-types";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import UserRank from "../../../lib/types/UserRankType";
import RefreshStatus from "../../../lib/types/RefreshStatus";
export default function MobileDataProvider(props: {
  children: React.ReactNode;
}) {
  const [confirmPhoneNumberCallback, setConfirmPhoneNumberCallback] = useState(
    () => {
      return async (code: string) => {
        console.log(
          "Attempted to confirm phone number, but no callback was set."
        );
      };
    }
  );

  const [oldCourseStates, setOldCourseStates] = useState({});

  const [invitedNumbers, setInvitedNumbers] = useState<string[] | null>(null);

  const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>({
    status: "No Data to Load",
    taskRemaining: 0,
    tasksCompleted: 0,
    type: "IDLE",
  });

  const mobileData = useMemo<MobileData>(
    () => ({
      confirmPhoneNumberCallback,
      setConfirmPhoneNumberCallback,
      oldCourseStates,
      setOldCourseStates,
      refreshStatus,
      setRefreshStatus,
      invitedNumbers,
      setInvitedNumbers,
    }),
    [
      confirmPhoneNumberCallback,
      setConfirmPhoneNumberCallback,
      oldCourseStates,
      setOldCourseStates,
      refreshStatus,
      setRefreshStatus,
      invitedNumbers,
      setInvitedNumbers,
    ]
  );

  return (
    <MobileDataContext.Provider value={mobileData}>
      {props.children}
    </MobileDataContext.Provider>
  );
}
