import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";

import "antd/dist/antd.css";
import "./assets/css/icons.scss";

import "./assets/css/customize1Defaults.scss";
import "./assets/css/customize2Light.scss";
import "./assets/css/customize3Dark.scss";
import "./assets/css/customize4Overwrites.scss";

import "./assets/css/global.scss";

import { AuthenticateProvider } from "./context/Auth";
import IconLoading from "./assets/icons/LoaderAnim.svg";
import Router from "./router";
import es_ES from "./settings/locale/es_ES.json";
import en_US from "./settings/locale/en_US.json";

console.log(`Starting app version: ${import.meta.env.REACT_APP_VERSION}`);

window.addEventListener("vite:preloadError", (event) => {
    /*
    When a new deployment occurs, the hosting service may delete the assets from previous deployments.
    As a result, a user who visited your site before the new deployment might encounter an import error.
    This error happens because the assets running on that user's device are outdated and it tries to import the
    corresponding old chunk, which is deleted. This event is useful for addressing this situation.*/
    console.log("preloadError");
    console.log(event);
});

async function loadTranslations() {
    try {
        await i18next.init({
            interpolation: { escapeValue: false },
            lng: "es",
            resources: {
                es: { translation: es_ES },
                en: { translation: en_US },
            },
        });
    } catch (error) {
        console.log(`Something wrong: ${error}`);
    }
}

loadTranslations();

function setColorMode() {
    const defaulTheme = getComputedStyle(document.querySelector(":root"))
        .getPropertyValue("--default-theme")
        .split('"')
        .join("");
    const storedTheme = localStorage.getItem("preferredColorScheme");
    document.documentElement.setAttribute(
        "data-theme",
        storedTheme ?? defaulTheme
    );
    localStorage.setItem("preferredColorScheme", storedTheme ?? defaulTheme);
}
setColorMode();
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
                                    position: "fixed",
                                    left: "50%",
                                    top: "50%",
                                    filter: "var(--color-nav-icon-filter-default)",
                                }}
                                width={50}
                                height={50}
                                src={IconLoading}
                                alt="Loading..."
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
