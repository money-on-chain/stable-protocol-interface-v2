import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useProjectTranslation } from '../../helpers/translations';

export default function ThemeMode() {
    const [t, i18n, ns] = useProjectTranslation();

    return (
        <>
            <div className="dappVersion">
                {t('settings.protocolName')} {process.env.REACT_APP_VERSION}
            </div>
        </>
    );
}
