import { TextField, TextFieldProps } from '@mui/material';
import { Controller, get, UseFormReturn } from 'react-hook-form';

interface Props {
    hookForm: UseFormReturn<any>;
    label: string;
    name: string;
    highlight?: boolean;
}

const HDTextField = ({
    hookForm: {
        formState: { touchedFields, errors },
        control
    },
    label,
    name = '',
    highlight = false,
    ...otherProps
}: Props & TextFieldProps) => {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue=""
            render={({ field }) => (
                <TextField
                    {...field}
                    fullWidth
                    error={get(errors, name)}
                    helperText={_.get(get(errors, name), 'message', '')}
                    {...otherProps}
                    label={label}
                    id={name}
                    name={name}
                    sx={{
                        ...otherProps.sx,
                        '.MuiOutlinedInput-notchedOutline': {
                            borderColor: highlight ? '#1890FF !important' : 'inherit'
                        },
                        '.Mui-disabled': {
                            color: highlight ? '#1890FF !important' : ''
                        }
                    }}
                />
            )}
        />
    );
};

export default HDTextField;
