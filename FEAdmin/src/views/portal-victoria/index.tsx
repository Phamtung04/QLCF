import React, { useEffect } from 'react';
import HDMenuView from './components/HDMenuView';
import useAuth from 'hooks/useAuth';
import { useLocation } from 'react-router-dom';

interface Props {
    tableInfo: any;
}
const PortalVictoriaPage: React.FC<Props> = ({ tableInfo }) => {
    const tableData = tableInfo;
    return <HDMenuView tableData={tableData} />;
};

export default PortalVictoriaPage;
