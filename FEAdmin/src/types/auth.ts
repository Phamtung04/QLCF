// third-party
import firebase from 'firebase/compat/app';
// project imports
import { UserProfile, UserInfo } from 'types/user-profile';

export type Auth0ContextType = {
    isLoggedIn: boolean;
    isInitialized?: boolean;
    user?: UserProfile | null | undefined;
    logout: () => void;
    login: () => void;
    resetPassword: (email: string) => void;
    updateProfile: VoidFunction;
};

export interface JWTDataProps {
    userId: string;
}

export type JWTContextType = {
    isLoggedIn: boolean;
    isInitialized?: boolean;
    user?: UserProfile | null | undefined;
    userInfo?: UserInfo | null | undefined;
    logout: () => void;
    login: (username: string, password: string) => Promise<any>;
    loginViaToken: (token: string) => Promise<any>;
    loginViaTabletToken: (token: string) => Promise<void>;
    registerDeviceID: (token: string, engine?: string) => Promise<any>;
    loadingPrepareData: boolean;
};

export interface InitialLoginContextProps {
    isLoggedIn: boolean;
    isInitialized?: boolean;
    user?: UserProfile | null | undefined;
    userInfo?: UserInfo | null | undefined;
}
