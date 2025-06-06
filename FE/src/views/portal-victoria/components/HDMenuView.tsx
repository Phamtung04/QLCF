import React, { useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import HDCategoryDrink from './HDCategoryDrink';
import HDFilterMenu from './HDFilterMenu';
import HDMenuDrink from './HDMenuDrink';
import { useLocation } from 'react-router-dom';

interface Table {
    rid: string;
    name: string;
    description: string;
    id: number;
    branchId: number;
}
interface Branch {
    manager_emails: string;
    rid: string;
    name: string;
    description: string;
    id: number;
}

const HDVictoriaView = () => {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(0);
    const [selectedTable, setSelectedTable] = useState<number | null>(0);
    const [selectedTableName, setSelectedTableName] = useState<string | null>('');
    const [selectedBranch, setSelectedBranch] = useState<number | null>(0);
    const [listTable, setListTable] = useState<Table[]>([]);
    const [listBranch, setListBranch] = useState<Branch[]>([]);
    const [keywork, setKeywork] = useState<string | null>('');
    const location = useLocation();
    const handleSelect = (id: number) => {
        setSelectedCategory(id);
    };
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const table_id = params.get('table_id');
        const branch_id = params.get('branch_id');
        if (table_id) {
            localStorage.setItem('table_id', table_id);
            getSelectedTable();
        }
        if (branch_id) {
            localStorage.setItem('branch_id', branch_id);
            getSelectedBranch();
        }
    }, []);
    const getSelectedTable = () => {
        const tableId = localStorage.getItem('table_id');
        if (tableId) {
            setSelectedTable(Number(tableId));
        }
    };
    const getSelectedBranch = () => {
        const branchId = localStorage.getItem('branch_id');
        if (branchId) {
            setSelectedBranch(Number(branchId));
        }
    };
    return (
        <MainCard>
            <HDFilterMenu
                getSelectedTable={getSelectedTable}
                setSelectedTable={setSelectedTable}
                selectedTable={selectedTable}
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
                listTable={listTable}
                listBranch={listBranch}
                setKeywork={setKeywork}
                keywork={keywork}
                setSelectedTableName={setSelectedTableName}
            />
            <HDCategoryDrink
                listTable={listTable}
                setListTable={setListTable}
                setListBranch={setListBranch}
                selectedBranch={selectedBranch}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                handleSelect={handleSelect}
            />
            <HDMenuDrink
                selectedTable={selectedTable}
                selectedBranch={selectedBranch}
                listTable={listTable}
                listBranch={listBranch}
                keywork={keywork}
                selectedCategory={selectedCategory}
                selectedTableName={selectedTableName}
            />
        </MainCard>
    );
};

export default HDVictoriaView;
