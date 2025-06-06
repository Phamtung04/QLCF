import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '@mui/lab';
import {
    Alert,
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconLogin } from '@tabler/icons';
import { Formik, FormikProps } from 'formik';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import React, { useRef } from 'react';
import { useLongPress } from 'react-use';
import { dispatch, useSelector } from 'store';
import { resetAuthInfo, setRememberAccount, setRememberMe } from 'store/slices/auth';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useStateIfMounted } from 'use-state-if-mounted';
import * as Yup from 'yup';

const AuthLogin = ({ loginProp, ...others }: { loginProp?: number }) => {
    const theme = useTheme();
    const formRef = useRef<FormikProps<any>>(null);
    const scriptedRef = useScriptRef();
    const [checked, setChecked] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const { authInfo } = useSelector((state) => state.authLogin);

    const { login, registerDeviceID, loadingPrepareData } = useAuth();

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const onLongPress = () => {
        formRef.current?.setFieldValue('usn', 'a1nv');
        formRef.current?.setFieldValue('pwd', 'T1Abc123!@#');
    };

    const defaultOptions = {
        isPreventDefault: true,
        delay: 1000
    };
    const longPressEvent = useLongPress(onLongPress, defaultOptions);

    return (
        <>
            <Formik
                innerRef={formRef}
                initialValues={{
                    usn: authInfo.username && authInfo.rememberMe ? authInfo.username : '',
                    pwd: authInfo.password && authInfo.rememberMe ? authInfo.password : '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    usn: Yup.string().max(255).required('Vui lòng nhập tên đăng nhập'),
                    pwd: Yup.string().max(255).required('Vui lòng nhập mật khẩu')
                })}
                onSubmit={async () => {}}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setErrors, validateForm }) => (
                    <form noValidate onSubmit={handleSubmit} autoComplete="off">
                        {errors.submit && (
                            <Box sx={{ mb: 2 }}>
                                <Alert severity="error">{errors.submit}</Alert>
                            </Box>
                        )}
                        <FormControl fullWidth error={Boolean(touched.usn && errors.usn)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-usn" color="secondary">
                                Tên Đăng Nhập
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-usn"
                                type="text"
                                value={values.usn}
                                name="usn"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Tên Đăng Nhập"
                                color="secondary"
                                sx={{
                                    padding: 'inherit !important',
                                    input: {
                                        height: 'auto !important'
                                    }
                                }}
                                inputProps={{
                                    'aria-autocomplete': 'none',
                                    autocomplete: 'off'
                                }}
                            />
                            {touched.usn && errors.usn && (
                                <FormHelperText error id="standard-weight-helper-text-usn">
                                    {errors.usn}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.pwd && errors.pwd)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-pwd" color="secondary">
                                Mật Khẩu
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-pwd"
                                type="text"
                                value={values.pwd}
                                name="pwd"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle pwd visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            size="large"
                                            sx={{ mr: 0 }}
                                            {...longPressEvent}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Mật Khẩu"
                                color="secondary"
                                sx={{
                                    padding: 'inherit !important',
                                    input: {
                                        height: 'auto !important'
                                    }
                                }}
                                inputProps={{
                                    'aria-autocomplete': 'none',
                                    autocomplete: 'off'
                                }}
                                className={showPassword ? '' : 'my-password-field'}
                            />
                            {touched.pwd && errors.pwd && (
                                <FormHelperText error id="standard-weight-helper-text-pwd">
                                    {errors.pwd}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormGroup>
                            <FormControlLabel
                                style={{ width: '100%', display: 'flex', alignItems: 'center' }}
                                control={
                                    <Checkbox
                                        onChange={(e) => {
                                            dispatch(setRememberMe(e.target.checked));
                                            if (!e.target.checked) {
                                                dispatch(resetAuthInfo());
                                            }
                                        }}
                                        checked={authInfo.rememberMe}
                                    />
                                }
                                label="Nhớ trạng thái đăng nhập"
                            />
                        </FormGroup>

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <LoadingButton
                                    disableElevation
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    loading={loading || loadingPrepareData}
                                    loadingPosition="start"
                                    startIcon={<IconLogin />}
                                    onClick={(e) => {
                                        validateForm(values).then((res) => {
                                            setErrors(res);
                                            if (_.isEmpty(res)) {
                                                try {
                                                    setLoading(true);
                                                    login(values.usn, values.pwd).then(
                                                        () => {
                                                            dispatch(
                                                                setRememberAccount({
                                                                    username: values.usn,
                                                                    password: values.pwd
                                                                })
                                                            );
                                                            setLoading(false);
                                                        },
                                                        (err: any) => {
                                                            setLoading(false);
                                                            if (scriptedRef.current) {
                                                                setErrors({ submit: _.get(err, 'error.message', 'Đã có lỗi xảy ra !') });
                                                            }
                                                            console.log(err);
                                                        }
                                                    );
                                                } catch (err: any) {
                                                    console.error(err);
                                                    if (scriptedRef.current) {
                                                        setLoading(false);
                                                        setErrors({ submit: err.message });
                                                    }
                                                }
                                            }
                                        });
                                    }}
                                >
                                    Đăng nhập
                                </LoadingButton>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthLogin;
