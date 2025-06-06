import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';

const HDTextFieldDebounced = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
} & TextFieldProps) => {
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);
        return () => clearTimeout(timeout);
    }, [value]);

    return <TextField {...props} fullWidth InputLabelProps={{ shrink: true }} onChange={(e) => setValue(e.target.value)} value={value} />;
};

export default HDTextFieldDebounced;
