import React, { useEffect, useState } from 'react';
import { Box, Typography, ButtonBase } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CategoryDialog from './Dialog/CategoryDialog';
import homeService from 'services/home-service/home.service';
import IcDrink from 'assets/images/noti.jpg';

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
    const IconCategory = 'https://cdn-icons-png.flaticon.com/512/4080/4080639.png';
    const fetchData = async () => {
        try {
            const [homeResponse] = await Promise.all([homeService.getAllFilterHome({ branchId: selectedBranch })]);
            console.log(homeResponse.result.listMenuCategories);
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
        <Box sx={{ maxHeight: '100vh', overflowY: 'auto', scrollbarWidth: 'none', backgroundColor: '#F8F9FA' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h2" component="div" mt={3} sx={{ fontWeight: 'bold' }}>
                    PVT EAUT
                </Typography>
            </Box>
            <Box
                mt={3}
                sx={{
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    '::-webkit-scrollbar': { display: 'none' }
                }}
            >
                <ButtonBase
                    onClick={() => handleSelect(0)}
                    sx={{
                        border: selectedCategory === 0 ? `2px solid #FFC20E` : `transparent`,
                        borderRadius: '10px',
                        p: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 2,
                        flexShrink: 0,
                        width: '106px',
                        height: 'auto'
                    }}
                >
                    <img src={IconCategory} alt={'danh mục'} style={{ width: 40, height: 40, borderRadius: '50%', marginBottom: '8px' }} />
                    <Typography sx={{ fontWeight: '400', fontSize: '16px', color: '#292929' }}>Tất cả</Typography>
                </ButtonBase>
                {listCategories.map((category) => (
                    <ButtonBase
                        key={category.id}
                        onClick={() => handleSelect(category.id)}
                        sx={{
                            border: selectedCategory === category.id ? `2px solid #FFC20E` : `transparent`,
                            borderRadius: '10px',
                            p: 1.5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 2,
                            flexShrink: 0,
                            width: '106px',
                            height: 'auto'
                        }}
                    >
                        {category.image && (
                            <img
                                src={category.image ? `${category.image}` : IcDrink}
                                alt={category.name}
                                style={{ width: 40, height: 40, borderRadius: '50%', marginBottom: '8px' }}
                            />
                        )}
                        <Typography sx={{ fontWeight: '400', fontSize: '16px', color: '#292929' }}>{category.name}</Typography>
                    </ButtonBase>
                ))}
            </Box>
            <CategoryDialog open={dialogOpen} handleClose={handleDialogClose} handleSelect={handleSelect} sampleData={listCategories} />
        </Box>
    );
};

export default HDCategoryDrink;
