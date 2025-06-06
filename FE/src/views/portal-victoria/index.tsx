import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import HDMenuView from './components/HDMenuView';
import useAuth from 'hooks/useAuth';

const PortalVictoriaPage = () => {
    return <HDMenuView />;
};

export default PortalVictoriaPage;
