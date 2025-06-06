import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemAvatar, ListItemText, Divider, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useTheme } from '@mui/material/styles';
import IcDrink from 'assets/images/noti.jpg';

interface Category {
    id: number;
    name: string;
    image: string | null;
}

interface CategoryDialogProps {
    open: boolean;
    handleClose: () => void;
    handleSelect: (id: number) => void;
    sampleData: Category[];
}

const Transition = React.forwardRef<unknown, TransitionProps & { children: React.ReactElement<any, any> }>((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CategoryDialog: React.FC<CategoryDialogProps> = ({ open, handleClose, handleSelect, sampleData }) => {
    const theme = useTheme();
    return (
        <Dialog
            sx={{ top: 'calc(100% - 500px)', height: 500, borderRadius: '20px 20px 0 0' }}
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <DialogTitle>Tất cả danh mục</DialogTitle>
            <DialogContent>
                <List>
                    {sampleData.map((category, index) => (
                        <React.Fragment key={category.id}>
                            <ListItem
                                button
                                onClick={() => {
                                    handleSelect(category.id);
                                    handleClose();
                                }}
                            >
                                <ListItemAvatar>
                                    {category.image && (
                                        <img
                                            src={category.image ? `${category.image}` : IcDrink}
                                            alt={category.name}
                                            style={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 25,
                                                border: `2px solid ${theme.palette.primary.main}`
                                            }}
                                        />
                                    )}
                                </ListItemAvatar>
                                <ListItemText primary={category.name} sx={{ fontSize: 20 }} />
                            </ListItem>
                            {index !== sampleData.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default CategoryDialog;
