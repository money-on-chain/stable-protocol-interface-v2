import React from 'react';
import { useProjectTranslation } from '../../helpers/translations';
import useTheme from '../UseTheme';
import ThemeMode from '../ThemeMode';
import DappVersion from '../DappVersion';

export default function DappFooter() {
    const [t, i18n, ns] = useProjectTranslation();
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            <div className="dashboard-footer desktop-only">
                <DappVersion />
                <ThemeMode />
            </div>
        </>
    );
}
