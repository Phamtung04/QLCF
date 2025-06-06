import { useEffect } from 'react';
import { useDispatch, useSelector } from 'store';
import { closeSearchBox } from 'store/slices/search';
import { GuardProps } from 'types';

const CompactSearchCustomerGuard = ({ children }: GuardProps) => {
    const dispatch = useDispatch();
    const { searchOpen } = useSelector((stateS) => stateS.search);

    useEffect(() => {
        if (searchOpen) {
            dispatch(closeSearchBox());
        }
    }, []);

    return <>{children}</>;
};

export default CompactSearchCustomerGuard;
