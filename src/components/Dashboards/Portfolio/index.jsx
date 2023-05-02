import React, { useContext, useState, useEffect } from 'react';

import { useProjectTranslation } from '../../../helpers/translations';
import TokensCA from '../../Tables/TokensCA';
import TokensTP from '../../Tables/TokensTP';
import { AuthenticateContext } from '../../../context/Auth';
import settings from '../../../settings/settings.json';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from '../../../helpers/Formats';
import { PrecisionNumbers } from '../../PrecisionNumbers';

export default function Portfolio() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    let balance;
    let price;
    let balanceUSD;
    let totalUSD = new BigNumber(0);

    // Total tokens

    // Tokens CA
    auth.contractStatusData &&
        auth.userBalanceData &&
        settings.tokens.CA.forEach(function (dataItem) {
            balance = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.userBalanceData.CA[dataItem.key].balance,
                    settings.tokens.CA[dataItem.key].decimals
                )
            );
            price = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.PP_CA[dataItem.key],
                    settings.tokens.CA[dataItem.key].decimals
                )
            );
            balanceUSD = balance.times(price);
            totalUSD = totalUSD.plus(balanceUSD);
        });

    // Tokens TP
    auth.contractStatusData &&
        auth.userBalanceData &&
        settings.tokens.TP.forEach(function (dataItem) {
            balance = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.userBalanceData.TP[dataItem.key],
                    settings.tokens.TP[dataItem.key].decimals
                )
            );
            price = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.PP_TP[dataItem.key],
                    settings.tokens.TP[dataItem.key].decimals
                )
            );
            balanceUSD = balance.div(price);
            totalUSD = totalUSD.plus(balanceUSD);
        });

    // Token TC
    if (auth.contractStatusData && auth.userBalanceData) {
        balance = new BigNumber(
            fromContractPrecisionDecimals(
                auth.userBalanceData.TC.balance,
                settings.tokens.TC.decimals
            )
        );
        price = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.getPTCac,
                settings.tokens.TC.decimals
            )
        );
        console.log("DEBUG PRICE GLITCH>>>")
        console.log(auth.contractStatusData.getPTCac.toString())
        balanceUSD = balance.times(price);
        totalUSD = totalUSD.plus(balanceUSD);
    }

    // Coinbase
    if (auth.contractStatusData && auth.userBalanceData) {
        balance = new BigNumber(
            fromContractPrecisionDecimals(
                auth.userBalanceData.coinbase,
                settings.tokens.COINBASE.decimals
            )
        );
        price = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.PP_COINBASE,
                settings.tokens.COINBASE.decimals
            )
        );
        balanceUSD = balance.times(price);
        totalUSD = totalUSD.plus(balanceUSD);
    }

    return (
        <div className="dashboard-portfolio">
            <div className="tokens-card-content">
                <div className="tokens-list-header">
                    <div className="tokens-list-header-title">Portfolio</div>
                    <div className="tokens-list-header-balance">
                        <div className="tokens-list-header-balance-number">
                            {PrecisionNumbers({
                                amount: totalUSD,
                                token: settings.tokens.COINBASE,
                                decimals: 2,
                                t: t,
                                i18n: i18n,
                                ns: ns,
                                skipContractConvert: true
                            })}{' '}
                            USD
                        </div>
                        <div className="tokens-list-header-balance-title">
                            Total balance
                        </div>
                    </div>
                </div>
                <div className="tokens-list-table">
                    <TokensCA />
                    <TokensTP />
                </div>
            </div>
        </div>
    );
}
