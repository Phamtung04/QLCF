export interface VerifyTokenResult {
    resultMessage: string;
    resultCode: string;
    data: VerifyTokenData | null | undefined;
}

export interface VerifyTokenData {
    employeeId: string;
    fullName: string;
    gender: '1' | '0';
    birthDate: string;
    email: string;
    jobTitleId: string;
    globalId: string;
    branchId: string;
    branchName: string;
    userRole: string;
    acctExec: string;
    userId: string;
    userBt: string;
}

export interface TabletTokenGeneratedData {
    data: {
        token: string;
    } | null;

    resultMessage: string;
    resultCode: string;
}

export interface TabletTokenGenerationInput {
    userRole?: string | number;
    acctExec?: string;
    userBt?: string;
    overrideUserMis?: string;
    overrideBranchNo?: string;
}
