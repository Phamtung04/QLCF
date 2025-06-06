import App from 'App';
import 'assets/scss/face-detect.scss';
import 'assets/scss/style.scss';
import { BASE_PATH } from 'config';
import { ConfigProvider } from 'contexts/ConfigContext';
import { createRoot } from 'react-dom/client';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import reportWebVitals from 'reportWebVitals';
import * as serviceWorker from 'serviceWorker';
import { persister, store } from 'store';
import 'utils/extensions';

// ==============================|| REACT DOM RENDER  ||============================== //

const queryClient = new QueryClient();

const container = document.getElementById('360-app');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

serviceWorker.register({
    onSuccess(r) {
        console.log(r);
    },
    onUpdate(s) {
        console.log(s);
    }
});

root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persister}>
            <ConfigProvider>
                <BrowserRouter basename={BASE_PATH}>
                    <QueryClientProvider client={queryClient}>
                        <App />
                    </QueryClientProvider>
                </BrowserRouter>
            </ConfigProvider>
        </PersistGate>
    </Provider>
);
serviceWorker.unregister();
reportWebVitals();
