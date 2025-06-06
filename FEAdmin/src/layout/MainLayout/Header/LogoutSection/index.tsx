import { Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';
import { IconLogout } from '@tabler/icons';
import useAuth from 'hooks/useAuth';
import toastService from 'services/core/toast.service';

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
    const { logout, user } = useAuth();
    const handleLogout = () => {
        try {
            toastService.showConfirm({
                title: 'Bạn có chắc?',
                text: 'Bạn có chắc muốn đăng xuất khỏi ứng dụng',
                onConfirm: async () => {
                    logout();
                }
            });
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <HeaderAvatarStyle variant="rounded" color="primary" onClick={handleLogout}>
            <IconLogout stroke={1.5} size="1.2rem" />
        </HeaderAvatarStyle>
    );
};
