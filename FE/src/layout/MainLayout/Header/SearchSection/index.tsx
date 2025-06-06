import { Avatar, Box, OutlinedInput, Popper } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';
import { IconSearch } from '@tabler/icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'store';
import { openSearchBox } from 'store/slices/search';
import AnimateButton from 'ui-component/extended/AnimateButton';

// styles

const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(({ theme }) => ({
    ...theme.typography.commonAvatar,
    ...theme.typography.mediumAvatar,
    background: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.main,
    color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
    '&:hover': {
        background: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.dark,
        color: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[800]
    }
}));

const SearchSection = () => {
    const dispatch = useDispatch();

    const { searchOpen } = useSelector((state) => state.search);

    const handleToggle = () => {
        dispatch(openSearchBox());
    };

    return (
        <>
            {!searchOpen && (
                <HeaderAvatarStyle variant="rounded" onClick={handleToggle} color="primary">
                    <IconSearch stroke={1.5} size="1.2rem" />
                </HeaderAvatarStyle>
            )}
        </>
    );
};

export default SearchSection;
