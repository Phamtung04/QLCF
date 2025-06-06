import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, IconButton, InputAdornment, Typography, Alert, Snackbar, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import useAuth from 'hooks/useAuth';

interface Table {
    id: number;
    name: string;
    branchId: number;
}
interface Branch {
    name: string;
    id: number;
    managerEmails: string | null;
}
interface Props {
    keywork: string | null;
    setKeywork: React.Dispatch<React.SetStateAction<string | null>>;
    listTable: Table[];
    selectedTable: number | null;
    selectedBranch: number | null;
    getSelectedTable: any;
    listBranch: Branch[];
    setSelectedBranch: any;
    setSelectedTable: any;
    setSelectedTableName: any;
}

const HDFillterMenu: React.FC<Props> = ({
    keywork,
    setKeywork,
    listTable,
    listBranch,
    selectedTable,
    getSelectedTable,
    selectedBranch,
    setSelectedBranch,
    setSelectedTable,
    setSelectedTableName
}) => {
    const { user } = useAuth();
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeywork(event.target.value);
    };

    const handleClearSearch = () => {
        setKeywork('');
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleBranchChange = (event: any, newValue: Branch | null) => {
        const value = newValue ? newValue.id : null;
        setSelectedBranch(value);
        setSelectedTable(null);
        localStorage.setItem('branch_id', value ? value.toString() : ''); // Store branch_id in localStorage
        localStorage.removeItem('table_id'); // Remove table_id from localStorage when branch changes
    };

    const handleTableChange = (event: any, newValue: Table | null) => {
        const value = newValue ? newValue.id : null;
        setSelectedTable(value);
        localStorage.setItem('table_id', value ? value.toString() : ''); // Store table_id in localStorage
    };

    useEffect(() => {
        getSelectedTable();
    }, []);

    useEffect(() => {
        const selectedTableObj = listTable.find((table) => table.id === selectedTable);

        if (!selectedTableObj || (selectedTableObj && selectedTableObj.branchId !== selectedBranch)) {
            setDialogOpen(true);
        } else {
            setDialogOpen(false);
            setSelectedTableName(selectedTableObj.name);
        }
    }, [selectedTable, selectedBranch, listTable]);

    const selectedTableName = listTable.find((table) => table.id === selectedTable)?.name || 'Không có bàn';
    const selectedBranchName = listBranch.find((branch) => branch.id === selectedBranch)?.name || 'Không có chi nhánh';

    return (
        <Box>
            <Grid container spacing={1.5} direction={{ xs: 'column', sm: 'row' }}>
                <Grid item xs={12}>
                    <Typography sx={{ fontSize: 17, fontWeight: '600' }} variant="subtitle1">
                        {selectedBranchName} - {selectedTableName}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Autocomplete
                        options={listBranch}
                        getOptionLabel={(option) => option.name}
                        onChange={handleBranchChange}
                        renderInput={(params) => <TextField {...params} label="Chi nhánh" />}
                        value={listBranch.find((branch) => branch.id === selectedBranch) || null}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Autocomplete
                        options={listTable.filter((table) => table.branchId === selectedBranch)}
                        getOptionLabel={(option) => option.name}
                        onChange={handleTableChange}
                        renderInput={(params) => <TextField {...params} label="Bàn" />}
                        value={listTable.find((table) => table.id === selectedTable) || null}
                        disabled={!selectedBranch} // Disable if no branch is selected
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Tìm kiếm"
                        placeholder="Tìm kiếm"
                        value={keywork || ''}
                        onChange={handleSearchChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {keywork ? (
                                        <IconButton onClick={handleClearSearch}>
                                            <CloseIcon />
                                        </IconButton>
                                    ) : (
                                        <SearchIcon />
                                    )}
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
            </Grid>
            {/* Dialog for invalid table selection */}
            <Snackbar
                open={dialogOpen}
                autoHideDuration={null}
                onClose={handleCloseDialog}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ width: '90%' }}
            >
                <Alert onClose={handleCloseDialog} severity="warning" variant="filled" sx={{ width: '100%' }}>
                    <div>Bàn không thuộc chi nhánh đã chọn.</div>
                    <div>Vui lòng chọn bàn hoặc quét lại QR.</div>
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default HDFillterMenu;
