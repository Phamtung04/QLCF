import Loading from 'components/Loading';
import LoadingBackdrop from 'components/LoadingBackdrop';
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import NavigationScroll from 'layout/NavigationScroll';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import Routes from 'routes';
import ThemeCustomization from 'themes';
import Snackbar from 'ui-component/extended/Snackbar';
import Locales from 'ui-component/Locales';

const App = () => {
    return (
        <ThemeCustomization>
            <Locales>
                <NavigationScroll>
                    <AuthProvider>
                        <>
                            <Routes />
                            <Snackbar />
                            <ToastContainer limit={5} enableMultiContainer />
                            <Loading />
                            <LoadingBackdrop />
                        </>
                    </AuthProvider>
                </NavigationScroll>
            </Locales>
        </ThemeCustomization>
    );
};

export default App;
