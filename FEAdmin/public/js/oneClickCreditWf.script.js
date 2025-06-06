'use strict';

window.oneClickCreditFunc = {
    async createAndSend({ toolkit, inputData, currentStep }) {
        try {
            var _inputData$files;
            const createEntity = await toolkit.axios.post(`/api/w360cv/yeu-cau/create-and-send`, {
                ...inputData,
                cmArgs: inputData.cmArgs,
                currentStep
            });
            if (
                (inputData === null || inputData === void 0
                    ? void 0
                    : (_inputData$files = inputData.files) === null || _inputData$files === void 0
                    ? void 0
                    : _inputData$files.length) > 0 &&
                inputData.files
            ) {
                const payloadUploadFile = {
                    id: createEntity.id,
                    files: inputData.files
                };
                toolkit.yeuCauService.uploadFile(payloadUploadFile);
            }
            return createEntity;
        } catch (error) {
            throw error;
        }
    },
    async approve({ toolkit, inputData, currentStep }) {
        try {
            const payloadExt = {
                extendProperties: inputData.extendProperties
            };
            await toolkit.yeuCauService.patchExtendProp(inputData.yeuCauId, payloadExt);
        } catch (e) {
            throw e;
        }

        try {
            const approveEntity = await toolkit.yeuCauService.approve(
                {
                    ...inputData,
                    currentStep
                },
                inputData.yeuCauId
            );
            return approveEntity;
        } catch (error) {
            throw error;
        }
    },
    async reject({ toolkit, inputData, currentStep }) {
        try {
            const payloadExt = {
                extendProperties: inputData.extendProperties
            };
            await toolkit.yeuCauService.patchExtendProp(inputData.yeuCauId, payloadExt);
        } catch (e) {
            throw e;
        }
        
        try {
            const forwardEntity = await toolkit.yeuCauService.reject(
                {
                    ...inputData,
                    currentStep,
                    nextStepId: null
                },
                inputData.yeuCauId
            );
            return forwardEntity;
        } catch (error) {
            throw error;
        }
    }
};
