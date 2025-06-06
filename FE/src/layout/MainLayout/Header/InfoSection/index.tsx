import { Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';
import { IconInfoCircle } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';

// styles

const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(({ theme }) => ({
    ...theme.typography.commonAvatar,
    ...theme.typography.mediumAvatar,
    background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
    color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
    '&:hover': {
        background: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.dark,
        color: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[800]
    }
}));

export default () => {
    const navigate = useNavigate();
    return (
        <a target="_blank" rel="noreferrer">
            <HeaderAvatarStyle variant="rounded" color="primary">
                <IconInfoCircle stroke={1.5} size="1.2rem" />
            </HeaderAvatarStyle>
        </a>
    );
};
