import React from 'react';
import { useProjectTranslation } from '../../helpers/translations';
import ThemeMode from '../ThemeMode';
import DappVersion from '../DappVersion';

export default function DappFooter() {
    const [t, i18n, ns] = useProjectTranslation();

    return (
        <>
            <div className="dashboard-footer desktop-only">
                <DappVersion />
                <ThemeMode />
            </div>
        </>
    );
}
