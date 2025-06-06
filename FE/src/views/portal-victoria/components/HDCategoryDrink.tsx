import React, { useEffect, useState } from 'react';
import { Box, Typography, ButtonBase } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CategoryDialog from './Dialog/CategoryDialog';
import homeService from 'services/home-service/home.service';
import tableService from 'services/table-service/table.service';
import IcDrink from 'assets/images/noti.jpg';
import branchService from 'services/branch-services/branch.service';

interface Category {
    id: number;
    name: string;
    image: string | null;
    quantity: number;
}
interface Props {
    selectedCategory: number | null;
    setSelectedCategory: React.Dispatch<React.SetStateAction<number | null>>;
    handleSelect: (id: number) => void;
    setListTable: any;
    listTable: any;
    selectedBranch: any;
    setListBranch: any;
}

const HDCategoryDrink: React.FC<Props> = ({
    selectedCategory,
    selectedBranch,
    handleSelect,
    setListTable,
    listTable,
    setSelectedCategory,
    setListBranch
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const theme = useTheme();
    const [listCategories, setListCategory] = useState<Category[]>([]);

    const fetchData = async () => {
        try {
            const [homeResponse] = await Promise.all([homeService.getAllFilterHome({ branchId: selectedBranch })]);

            if (homeResponse) {
                setListCategory(homeResponse.result.listMenuCategories);
                setListTable(homeResponse.result.listTable);
                setListBranch(homeResponse.result.listBranch);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [selectedBranch]);
    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <Box>
            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: 16 }} variant="subtitle1">
                    Danh mục
                </Typography>
                <Typography color={theme.palette.primary.main} variant="subtitle1" onClick={handleDialogOpen} style={{ cursor: 'pointer' }}>
                    Xem tất cả
                </Typography>
            </Box>
            <Box mt={3} sx={{ overflowX: 'auto', display: 'flex', '::-webkit-scrollbar': { display: 'none' } }}>
                <ButtonBase
                    onClick={() => handleSelect(0)}
                    sx={{
                        border: `1px solid ${theme.palette.primary.main}`,
                        borderRadius: '20px',
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        mr: 2,
                        flexShrink: 0,
                        backgroundColor: selectedCategory === 0 ? theme.palette.primary.main : 'transparent',
                        color: selectedCategory === 0 ? theme.palette.primary.light : 'inherit'
                    }}
                >
                    <Typography>Tất cả</Typography>
                </ButtonBase>
                {listCategories
                    .filter((category) => category.quantity > 0)
                    .map((category) => (
                        <ButtonBase
                            key={category.id}
                            onClick={() => handleSelect(category.id)}
                            sx={{
                                border: `1px solid ${theme.palette.primary.main}`,
                                borderRadius: '20px',
                                p: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                mr: 2,
                                flexShrink: 0,
                                backgroundColor: selectedCategory === category.id ? theme.palette.primary.main : 'transparent',
                                color: selectedCategory === category.id ? theme.palette.primary.light : 'inherit'
                            }}
                        >
                            {category.image && (
                                <img
                                    src={category.image ? `${category.image}` : IcDrink}
                                    alt={category.name}
                                    style={{ width: 30, height: 30, borderRadius: '50%', marginRight: '8px' }}
                                />
                            )}
                            <Typography>{category.name}</Typography>
                        </ButtonBase>
                    ))}
            </Box>
            <CategoryDialog open={dialogOpen} handleClose={handleDialogClose} handleSelect={handleSelect} sampleData={listCategories} />
        </Box>
    );
};

export default HDCategoryDrink;
