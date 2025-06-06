import React from 'react';
import { Paper, InputBase, IconButton, MenuItem, Select } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';

const CustomSelect = ({ options, value, onChange, list, selected, placeholder }) => {
    const selectedLabel = list.find((item) => item.id === selected)?.name || placeholder;

    return (
        <Paper
            component="form"
            sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                height: '42px',
                backgroundColor: '#EAEEF2',
                borderRadius: '42px'
            }}
        >
            <Select
                value={value}
                onChange={onChange}
                displayEmpty
                input={<InputBase sx={{ ml: 1, flex: 1 }} />}
                renderValue={() => selectedLabel}
                sx={{ ml: 1, flex: 1, backgroundColor: '#EAEEF2', borderRadius: '42px' }}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </Paper>
    );
};

export default CustomSelect;
