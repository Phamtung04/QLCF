import { useDispatch, useSelector } from 'store';
import { clearInfoBtUser, setInfoBtUser, setInfoBtUserUnauthorize, verify } from 'store/slices/bt-user';

// ----------------------------------------------------------------------

type Options = { user?: any };

export default function useBtUser({ user }: Options = {}) {
    const { btUserUnauthorize } = useSelector((state) => state.btUser);

    const dispatch = useDispatch();

    const setBtUserState = (data) => {
        dispatch(setInfoBtUserUnauthorize(data));
    };
    const installBtUser = () => {
        dispatch(setInfoBtUser(btUserUnauthorize));
        dispatch(verify(true));
    };
    const clearBtUser = () => {
        dispatch(clearInfoBtUser());
        dispatch(verify(false));
    };

    return {
        btUserState: btUserUnauthorize,
        setBtUserState,
        installBtUser,
        clearBtUser
    };
}
