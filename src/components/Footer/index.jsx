import { func } from 'prop-types';
import React from 'react';
import { useProjectTranslation } from '../../helpers/translations';

export default function DappFooter() {
    const [t, i18n, ns] = useProjectTranslation();

    /*
     * If a color scheme preference was previously stored,
     * select the corresponding option in the color scheme preference UI
     * unless it is already selected.
     */
    function restoreColorSchemePreference() {
        const colorScheme = localStorage.getItem(colorSchemeStorageItemName);
        const defaultScheme = getComputedStyle(document.querySelector(':root'))
            .getPropertyValue('--default-theme')
            .split('"')
            .join('');

        switch (colorScheme) {
            case null: {
                // There is no selection for local storage. Use default scheme in customization.scss
                if (defaultScheme == 'light') {
                    setSchemeElementsDark(false);
                    return;
                } else {
                    setSchemeElementsDark(true);
                    return;
                }
            }
            case 'light': {
                setSchemeElementsDark(false);
                return;
            }
            case 'dark': {
                setSchemeElementsDark(true);
                return;
            }
            default: {
                return;
            }
        }
    }

    function setSchemeElementsDark(isDark) {
        // Set button and button text based on current selection
        if (isDark) {
            colorSchemeSelectorEl.checked = true;
            document.getElementById('SchemeText').innerText = t(
                'settings.themeMode.dark'
            );
        } else {
            colorSchemeSelectorEl.checked = false;
            document.getElementById('SchemeText').innerText = t(
                'settings.themeMode.light'
            );
        }
    }

    /*
     * Store an event target's value in localStorage under colorSchemeStorageItemName
     */
    function storeColorSchemePreference({ target }) {
        if (target.checked) {
            var colorScheme = 'dark';
            document.getElementById('SchemeText').innerText = t(
                'settings.themeMode.dark'
            );
        } else {
            var colorScheme = 'light';
            document.getElementById('SchemeText').innerText = t(
                'settings.themeMode.light'
            );
        }

        localStorage.setItem(colorSchemeStorageItemName, colorScheme);
    }

    const colorSchemeStorageItemName = 'preferredColorScheme';
    const colorSchemeSelectorEl = document.querySelector(
        '#color-scheme-selector'
    );

    if (colorSchemeSelectorEl) {
        restoreColorSchemePreference();
        colorSchemeSelectorEl.addEventListener(
            'input',
            storeColorSchemePreference
        );
    }

    return (
        <div className="dashboard-footer">
            {/* dApp Version */}
            <div className="dappVersion">
                {t('settings.protocolName')} {process.env.REACT_APP_VERSION}
            </div>

            {/* Light/Dark mode toggle */}
            <div className="lightModeContainer">
                <div className="lightModeSwitch">
                    <input
                        type="checkbox"
                        id="color-scheme-selector"
                        className="color-scheme-selector"
                        value="default"
                    ></input>
                    <label htmlFor="color-scheme-selector"></label>
                </div>
                <div id="SchemeText" className="lightModeText">
                    Light Mode
                </div>
            </div>
        </div>
    );
}
