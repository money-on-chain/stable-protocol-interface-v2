import React from 'react';
import ReactDOM from "react-dom/client";
import { HashRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

import './index.css';
import './assets/css/customization.scss';
import './assets/css/global.scss';
import './assets/css/components.scss';
import './assets/css/navigation.scss';

import reportWebVitals from './reportWebVitals';
import { AuthenticateProvider } from './context/Auth';

// import IconWaiting from './assets/icons/status-pending.png';
import IconLoading from './assets/icons/LoaderAnim.svg';
import Router from './router';

import es_ES from './settings/es_ES.json';
import en_US from './settings/en_US.json';

console.log(`Starting app version: ${process.env.REACT_APP_VERSION}`);

async function loadTranslations() {
    try {
        await i18next.init({
            interpolation: { escapeValue: false },
            lng: 'en',
            resources: {
                es: { translation: es_ES },
                en: { translation: en_US }
            }
        });
    } catch (error) {
        console.log(`Something wrong: ${error}`);
    }
}

loadTranslations();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <I18nextProvider i18n={i18next}>
            <AuthenticateProvider>
                <HashRouter>
                    {/*<React.Suspense fallback={ <span>Loading...</span> }>*/}
                    <React.Suspense
                        fallback={
                            <img
                                style={{
                                    position: 'fixed',
                                    left: '50%',
                                    top: '50%',
                                    // transform: 'translateX(-50%) translateY(-50%)'
                                    filter: 'var(--color-navigation-icon-filter-default)',
                                }}
                                width={50}
                                height={50}
                                src={IconLoading}
                                alt="Loading..."
                                // className={'img-status rotate'}
                            />
                        }
                    >
                        <Router />
                    </React.Suspense>
                </HashRouter>
            </AuthenticateProvider>
        </I18nextProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
