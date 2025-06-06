/* eslint-disable */

import { TabletTokenGeneratedData, TabletTokenGenerationInput, VerifyTokenResult } from 'types/token-provider';
import axiosServices from 'utils/axios';

const verifyTabletToken = (token: string): Promise<VerifyTokenResult> =>
    axiosServices.post('api/token-provider/tablet-token/verify', { token });

const generateTabletToken = (hdCode: string, options?: TabletTokenGenerationInput): Promise<TabletTokenGeneratedData> =>
    axiosServices.post('api/token-provider/tablet-token', { hdCode, ...options });

export default {
    verifyTabletToken,
    generateTabletToken
}