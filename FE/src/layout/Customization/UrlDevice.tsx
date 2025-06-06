// material-ui
import HDTextFieldDebounced from 'components/form/HDTextFieldDebounced';

// project imports
import useConfig from 'hooks/useConfig';
import { useState } from 'react';
import SubCard from 'ui-component/cards/SubCard';

const UrlDevice = () => {
    const {
        urlFaceService,
        urlFingerService,
        urlLoginBtUserService,
        onChangeUrlFaceService,
        onChangeUrlFingerService,
        onChangeUrlLoginBtUserService
    } = useConfig();
    return (
        <SubCard title="Websocket">
            <HDTextFieldDebounced
                value={urlFaceService}
                label="Url Face WS"
                onChange={(value) => {
                    onChangeUrlFaceService(value);
                }}
                sx={{ mb: 3 }}
            />
            <HDTextFieldDebounced
                value={urlFingerService}
                label="Url Finger WS"
                onChange={(value) => {
                    onChangeUrlFingerService(value);
                }}
                sx={{ mb: 3 }}
            />

            <HDTextFieldDebounced
                value={urlLoginBtUserService}
                label="Url Login User BT"
                onChange={(value) => {
                    onChangeUrlLoginBtUserService(value);
                }}
            />
        </SubCard>
    );
};

export default UrlDevice;
