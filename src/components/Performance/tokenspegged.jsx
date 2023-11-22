import React, { useContext, useState, useEffect } from 'react';

import { useProjectTranslation } from '../../helpers/translations';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { TokenSettings } from '../../helpers/currencies';
import { AuthenticateContext } from '../../context/Auth';
import settings from '../../settings/settings.json';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from '../../helpers/Formats';

export default function TokensPegged() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const totalPeggedInUSD = () => {

        let totalUSD = new BigNumber(0);

        // Tokens TPs
        auth.contractStatusData &&
        settings.tokens.TP.forEach(function (dataItem) {
            const balance = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.pegContainer[dataItem.key],
                    settings.tokens.TP[dataItem.key].decimals
                )
            );
            const price = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.PP_TP[dataItem.key],
                    settings.tokens.TP[dataItem.key].decimals
                )
            );
            const balanceUSD = balance.div(price);
            totalUSD = totalUSD.plus(balanceUSD);
        });

        return totalUSD;
    };

    return (

        <div className="card-tps">

            <div className="title">
                <h1>Tokens pegged</h1>
            </div>

            <div className="card-content">

                { settings.tokens.CA.map(function (token, i) {
                    return (
                        <div className={`row-${i+1}`}>

                            <div className="coll-1">
                                <div className="amount">
                                    {PrecisionNumbers({
                                        amount: totalPeggedInUSD(),
                                        token: TokenSettings('CA_0'),
                                        decimals: 2,
                                        t: t,
                                        i18n: i18n,
                                        ns: ns,
                                        skipContractConvert: true
                                    })}
                                </div>
                                <div className="caption">Total supply in USD</div>
                            </div>

                        </div>
                    )})
                }

            </div>

        </div>


    );
}
