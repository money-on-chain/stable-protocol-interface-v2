import { func } from 'prop-types';
import React from 'react';
import { useProjectTranslation } from '../../helpers/translations';
import toggleTheme from '../UseTheme';
import useTheme from '../UseTheme';

export default function DappFooter() {
    const [t, i18n, ns] = useProjectTranslation();
    const { theme, toggleTheme } = useTheme();

    return (
        <>
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
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                        ></input>
                        <label htmlFor="color-scheme-selector"></label>
                    </div>
                    <div id="SchemeText" className="lightModeText">
                        {t('settings.themeMode.' + theme)}
                    </div>
                </div>
            </div>
        </>
    );
}
