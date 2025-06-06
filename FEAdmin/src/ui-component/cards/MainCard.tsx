import { Card, CardContent, CardContentProps, CardHeader, CardHeaderProps, CardProps, Collapse, Divider, Typography } from '@mui/material';
// material-ui
import { useTheme } from '@mui/material/styles';
import React, { Ref } from 'react';
// project imports
import { KeyedObject } from 'types';

// ==============================|| CUSTOM MAIN CARD ||============================== //

export interface MainCardProps extends KeyedObject {
    border?: boolean;
    boxShadow?: boolean;
    children: React.ReactNode | string;
    style?: React.CSSProperties;
    content?: boolean;
    className?: string;
    contentClass?: string;
    contentSX?: CardContentProps['sx'];
    headerSX?: CardHeaderProps['sx'];
    darkTitle?: boolean;
    sx?: CardProps['sx'];
    secondary?: CardHeaderProps['action'];
    shadow?: string;
    elevation?: number;
    title?: React.ReactNode | string | ((showContent: any) => React.ReactNode);
    isCollapseContent?: boolean;
    defaultShowCollapseContent?: boolean;
    borderHeader?: boolean;
}

const MainCard = React.forwardRef(
    (
        {
            border = false,
            boxShadow = false,
            children,
            content = true,
            contentClass = '',
            contentSX = {},
            headerSX = {},
            darkTitle,
            secondary,
            shadow,
            sx = {},
            title,
            isCollapseContent = false,
            defaultShowCollapseContent = true,
            borderHeader = false,
            ...others
        }: MainCardProps,
        ref: Ref<HTMLDivElement>
    ) => {
        const theme = useTheme();
        const [checked, setChecked] = React.useState(defaultShowCollapseContent);

        const handleCollapse = () => {
            if (isCollapseContent) setChecked((prev) => !prev);
        };
        return (
            <Card
                ref={ref}
                {...others}
                sx={{
                    border: border ? '1px solid' : 'none',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary[200] + 75,
                    // ':hover': {
                    //     boxShadow: boxShadow
                    //         ? shadow ||
                    //           (theme.palette.mode === 'dark' ? '0px 4px 12px rgb(33 150 243 / 10%)' : '0px 4px 12px rgb(32 40 45 / 8%)')
                    //         : 'inherit'
                    // },
                    boxShadow: boxShadow
                        ? shadow ||
                          (theme.palette.mode === 'dark' ? '0 2px 14px 0 rgb(33 150 243 / 10%)' : '0 2px 14px 0 rgb(32 40 45 / 8%)')
                        : 'inherit',
                    ...sx
                }}
            >
                {/* card header and action */}
                {!darkTitle && title && (
                    <CardHeader
                        sx={{
                            ...headerSX,
                            '& .MuiCardHeader-action': { mr: 0 },
                            cursor: isCollapseContent ? 'pointer' : 'default',
                            border: 'none'
                        }}
                        title={_.isFunction(title) ? title(checked) : title}
                        action={secondary}
                        onClick={handleCollapse}
                    />
                )}
                {darkTitle && title && (
                    <CardHeader
                        sx={{
                            ...headerSX,
                            '& .MuiCardHeader-action': { mr: 0 },
                            cursor: isCollapseContent ? 'pointer' : 'default',
                            border: 'none'
                        }}
                        title={<Typography variant="h3">{_.isFunction(title) ? title(checked) : title}</Typography>}
                        action={secondary}
                        onClick={handleCollapse}
                    />
                )}

                {/* content & header divider */}
                {borderHeader && <Divider />}

                {/* card content */}
                {content && (
                    <Collapse in={checked}>
                        <CardContent sx={contentSX} className={contentClass}>
                            {children}
                        </CardContent>
                    </Collapse>
                )}
                {!content && children}
            </Card>
        );
    }
);

export default MainCard;
