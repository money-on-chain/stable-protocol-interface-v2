import React, { Fragment, useContext, useEffect, useState } from "react";
import { useProjectTranslation } from "../../helpers/translations";

export default function DappVersion() {
    const [t, i18n, ns] = useProjectTranslation();

    return (
        <>
            <div className="dappVersion">
                {t("settings.protocolName")} {import.meta.env.REACT_APP_VERSION}
            </div>
        </>
    );
}
