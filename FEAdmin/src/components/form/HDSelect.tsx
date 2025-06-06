import { Autocomplete, TextField } from '@mui/material';
import _ from 'lodash';
import { useEffect } from 'react';
import { get, UseFormReturn } from 'react-hook-form';

interface SelectDataSource {
    id: any;
    label: string;
    [name: string]: string;
}

interface Props {
    hookForm: UseFormReturn<any>;
    label: string;
    name: string;
    required?: boolean;
    options?: SelectDataSource[] | any;
    api?: string;
    handleSelectExtend?: (value: any) => void;
    fieldLabel?: string;
    fieldId?: string;
    highlight?: boolean;
    [namd: string]: any;
}

const HDSelect = ({
    hookForm: {
        watch,
        setValue,
        register,
        formState: { errors, touchedFields, isSubmitted },
        control
    },
    label,
    name,
    required,
    options,
    api,
    handleSelectExtend,
    fieldLabel = 'name',
    fieldId = 'id',
    highlight = false,
    ...otherProps
}: Props) => {
    useEffect(() => {
        (_.isNull(watch(name + 'HideObj')) || _.isUndefined(watch(name + 'HideObj'))) &&
            setValue(name + 'HideObj', _.find(options, (x) => x[fieldId] === watch(name)) || null);
    }, [watch(name)]);

    return (
        <Autocomplete
            id={name}
            {...register(name)}
            value={_.find(options, (x) => x[fieldId] === watch(name)) || null}
            // value={watch(name + 'HideObj') || null}
            onChange={(e, newValue: any, reson, details) => {
                setValue(name, _.get(newValue, [fieldId], ''), { shouldValidate: true });
                setValue(name + 'HideObj', newValue);
                handleSelectExtend?.(newValue);
            }}
            isOptionEqualToValue={(option, value) => {
                if (_.isUndefined(value[fieldId])) return false;
                return _.get(option, fieldId, '') === _.get(value, fieldId, '');
            }}
            options={options}
            getOptionLabel={(option) => option[fieldLabel] || ''}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={otherProps.placeholder}
                    required={required}
                    error={!watch(name) && get(errors, name)}
                    helperText={!watch(name) && _.get(get(errors, name), 'message', '')}
                    label={label}
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
            disableClearable={required}
            noOptionsText="Không có dữ liệu"
            loadingText="Đang tải dữ liệu . . ."
            {...otherProps}
        />
    );
};

export default HDSelect;
