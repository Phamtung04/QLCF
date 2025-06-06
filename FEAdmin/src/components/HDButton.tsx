import { Button, ButtonProps } from '@mui/material';
import React from 'react';

interface Props {
    colorOverride?: string;
    children: React.ReactNode;
}

const HDButton = ({ colorOverride = '', children, ...otherProps }: Props & ButtonProps) => {
    return (
        <Button
            variant="contained"
            disableElevation
            sx={{
                ...otherProps.sx,
                background: colorOverride && colorOverride,
                color: colorOverride && invertColor(colorOverride),
                '&.MuiButtonBase-root:hover': {
                    backgroundColor: colorOverride && colorOverride
                }
            }}
            {...otherProps}
        >
            {children}
        </Button>
    );
};

export default HDButton;
