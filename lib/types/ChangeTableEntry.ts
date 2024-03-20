export type ChangeTableEntry = {
    assignmentName: string;
    primaryData: string;
    secondaryData: string;
}

export type ChangeTable = {
    changed: boolean;
    oldAverage: string;
    newAverage: string;
    newGrades: ChangeTableEntry[] | undefined;
    removedGrades: ChangeTableEntry[][] | undefined;
}