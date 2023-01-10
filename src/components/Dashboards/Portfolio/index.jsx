import React, { useContext, useState, useEffect } from 'react';

import {useProjectTranslation} from "../../../helpers/translations";
import TokensCA from "../../Tables/TokensCA";
import TokensTP from "../../Tables/TokensTP";


export default function Portfolio() {
    const [t, i18n, ns] = useProjectTranslation();

    return (
        <div className="dashboard-portfolio">
            <div className="tokens-card-content">
                <div className="tokens-list-header">
                    <div className="tokens-list-header-title">Portfolio</div>
                    <div className="tokens-list-header-balance">
                        <div className="tokens-list-header-balance-number">23,243.23 USD</div>
                        <div className="tokens-list-header-balance-title">Total balance</div>
                    </div>
                </div>
                <div className="tokens-list-table">
                    <TokensCA />
                    <TokensTP />
                </div>
            </div>
        </div>
    )
}