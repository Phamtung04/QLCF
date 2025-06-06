import React, { useEffect, useState, useRef } from 'react';
import { Box, Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import HDCategoryDrink from './HDCategoryDrink';
import HDShoppingCart from './HDShoppingCart';
import HDMenuDrink from './HDMenuDrink';

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
    const [addDrinkDialogOpen, setAddDrinkDialogOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const location = useLocation();
    const cartRef = useRef<HTMLDivElement>(null);

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
    }, [location.search]);

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

    const handleAddDrinkDialogClose = () => {
        setAddDrinkDialogOpen(false);
    };

    const handleDialogOpen = () => {
        handleAddDrinkDialogClose();
        setDialogOpen(true);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
                <Grid container>
                    <Grid item xs={1.5}>
                        <HDCategoryDrink
                            listTable={listTable}
                            setListTable={setListTable}
                            setListBranch={setListBranch}
                            selectedBranch={selectedBranch}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            handleSelect={handleSelect}
                        />
                    </Grid>
                    <Grid item xs={9.5}>
                        <HDMenuDrink
                            setKeywork={setKeywork}
                            selectedTable={selectedTable}
                            selectedBranch={selectedBranch}
                            listTable={listTable}
                            listBranch={listBranch}
                            keywork={keywork}
                            selectedCategory={selectedCategory}
                            selectedTableName={selectedTableName}
                            setSelectedBranch={setSelectedBranch}
                            setSelectedTable={setSelectedTable}
                            setCartItemCount={setCartItemCount}
                            cartItemCount={cartItemCount}
                            dialogOpen={dialogOpen}
                            setDialogOpen={setDialogOpen}
                            cartRef={cartRef}
                            setSelectedTableName={setSelectedTableName}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <HDShoppingCart
                            handleDialogOpen={handleDialogOpen}
                            setCartItemCount={setCartItemCount}
                            cartItemCount={cartItemCount}
                            cartRef={cartRef}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default HDVictoriaView;
