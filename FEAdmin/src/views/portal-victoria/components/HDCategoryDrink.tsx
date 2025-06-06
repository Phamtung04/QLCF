import React, { useEffect, useState } from 'react';
import { Box, Typography, ButtonBase } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CategoryDialog from './Dialog/CategoryDialog';
import homeService from 'services/home-service/home.service';
import useAuth from 'hooks/useAuth';

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
    building_id: number;
}

const HDCategoryDrink: React.FC<Props> = ({ selectedCategory, setSelectedCategory, handleSelect, building_id }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const theme = useTheme();
    const { user, userInfo } = useAuth();
    const [listCategories, setListCategory] = useState<Category[]>([]);
    const [totalQuantity, setTotalQuantity] = useState<number>(0);

    const fetchData = async () => {
        try {
            const response = await homeService.getAllFilterHome({ id: userInfo?.id ?? 0, buildingId: building_id });
            if (response) {
                setListCategory(response.result.listMenuCategories);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let total = 0;
        listCategories.forEach((category) => {
            if (category.quantity) {
                total += category.quantity;
            }
        });
        setTotalQuantity(total);
    }, [listCategories]);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <Box>
            <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', maxHeight: '800px', overflowY: 'auto', scrollbarWidth: 'none' }}>
                <ButtonBase
                    onClick={() => handleSelect(0)}
                    sx={{
                        borderRadius: '10px',
                        flexDirection: 'column',
                        textAlign: 'flex-start',
                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                        p: 1.5,
                        mb: 1.5,
                        backgroundColor: selectedCategory === 0 ? theme.palette.primary.main : 'white'
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            textAlign: 'left',
                            width: '100%',
                            color: selectedCategory === 0 ? theme.palette.primary.light : 'inherit'
                        }}
                    >
                        Tất cả
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: 'left',
                            width: '100%',
                            mt: 2,
                            color: selectedCategory === 0 ? theme.palette.primary.light : 'inherit'
                        }}
                    >
                        {totalQuantity} đồ uống
                    </Typography>
                </ButtonBase>
                {listCategories
                    .filter((category) => category.quantity > 0)
                    .map((category) => (
                        <ButtonBase
                            key={category.id}
                            onClick={() => handleSelect(category.id)}
                            sx={{
                                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                                flexDirection: 'column',
                                borderRadius: '10px',
                                p: 1.5,
                                mb: 1.5,
                                backgroundColor: selectedCategory === category.id ? theme.palette.primary.main : 'white'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    textAlign: 'left',
                                    width: '100%',
                                    color: selectedCategory === category.id ? theme.palette.primary.light : 'inherit'
                                }}
                            >
                                {category.name}
                            </Typography>
                            <Typography
                                sx={{
                                    textAlign: 'left',
                                    width: '100%',
                                    mt: 2,
                                    color: selectedCategory === category.id ? theme.palette.primary.light : 'inherit'
                                }}
                            >
                                {category.quantity} đồ uống
                            </Typography>
                        </ButtonBase>
                    ))}
            </Box>
            <CategoryDialog open={dialogOpen} handleClose={handleDialogClose} handleSelect={handleSelect} sampleData={listCategories} />
        </Box>
    );
};

export default HDCategoryDrink;
