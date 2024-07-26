import React, { useContext, useState, useEffect } from 'react';
import { Col, Row } from 'antd';

import { useProjectTranslation } from '../../helpers/translations';
import { AuthenticateContext } from '../../context/Auth';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { TokenSettings } from '../../helpers/currencies';
import CollateralAssets from './collateral';
import TokensPegged from './tokenspegged';
import BigNumber from 'bignumber.js';
import CheckStatus from '../../helpers/checkStatus';
import { fromContractPrecisionDecimals } from '../../helpers/Formats';
import settings from '../../settings/settings.json';

export default function Performance(props) {
    const [isValid, setIsValid] = useState(true);
    const [statusIcon, setStatusIcon] = useState('');
    const [statusLabel, setStatusLabel] = useState('--');
    const [statusText, setStatusText] = useState('--');
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const { checkerStatus } = CheckStatus();
    useEffect(() => {
        if ((auth.contractStatusData, auth.userBalanceData)) {
            const { isValid, statusIcon, statusLabel, statusText } = checkerStatus();
            setIsValid(isValid);
            setStatusIcon(statusIcon);
            setStatusLabel(statusLabel);
            setStatusText(statusText);
        }
    }, [auth.contractStatusData, auth.userBalanceData]);

    let price;
    let collateralInUSD;
    if (auth.contractStatusData) {
        const priceTEC = new BigNumber(fromContractPrecisionDecimals(auth.contractStatusData.getPTCac, settings.tokens.TC.decimals));

        const priceCA = new BigNumber(fromContractPrecisionDecimals(auth.contractStatusData.PP_CA[0], settings.tokens.CA[0].decimals));
        price = priceTEC.times(priceCA);

        const collateralTotal = new BigNumber(fromContractPrecisionDecimals(auth.contractStatusData.nACcb, settings.tokens.TC.decimals));
        collateralInUSD = collateralTotal.times(priceCA);
    }
    return (
        <div className="sectionPerformance">
            {/* System Status */}
            <div className="perCard perfSystemStatus">
                <div className="card-system-status">
                    <div className="layout-card-title">
                        <h1>{t('performance.status.cardTitle')}</h1>
                    </div>

                    <div className="card-content">
                        <div className="coll-1">
                            <div className="stat-text">{statusText}</div>
                        </div>
                        <div className="coll-2">
                            <div className="stat-icon">
                                <div className={`${statusIcon} display-block`}></div> {statusLabel}
                            </div>
                            <div className="block-info">
                                {t('performance.status.showingBlock')}{' '}
                                {auth.contractStatusData ? BigInt(auth.contractStatusData.blockHeight).toString() : '--'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Total Value Locked */}
            <div>
                <div className="perfCard perfTVL">
                    <div className="layout-card-title">
                        <h1>{t('performance.tvl.cardTitle')}</h1>
                    </div>

                    <div className="card-content">
                        <div className="big-number">
                            {!auth.contractStatusData.canOperate
                                ? '--'
                                : PrecisionNumbers({
                                      amount: collateralInUSD ? collateralInUSD : new BigNumber(0),
                                      token: TokenSettings('CA_0'),
                                      decimals: 2,
                                      t: t,
                                      i18n: i18n,
                                      ns: ns,
                                      skipContractConvert: true
                                  })}
                        </div>
                        <div className="caption">{t('performance.tvl.expressedIn')}</div>
                    </div>
                </div>
            </div>
            {/* Leveraged Token */}
            <div className="pefCard perfTC">
                <div className="title">
                    <h1>
                        <div className="icon-token-tc display-block"></div> {t(`exchange.tokens.TC.label`, { ns: ns })}
                    </h1>
                </div>

                <div className="card-content">
                    <div className="row-1">
                        <div className="coll-1">
                            <div className="amount">
                                {!auth.contractStatusData.canOperate
                                    ? '--'
                                    : PrecisionNumbers({
                                          amount: price,
                                          token: settings.tokens.TC,
                                          decimals: 8,
                                          t: t,
                                          i18n: i18n,
                                          ns: ns,
                                          skipContractConvert: true
                                      })}
                            </div>
                            <div className="caption"> {t('performance.tc.priceIn')}</div>
                        </div>
                        <div className="coll-2">
                            <div className="amount">
                                {!auth.contractStatusData.canOperate
                                    ? '--'
                                    : PrecisionNumbers({
                                          amount: auth.contractStatusData ? auth.contractStatusData.getLeverageTC : new BigNumber(0),
                                          token: TokenSettings('TC'),
                                          decimals: 8,
                                          t: t,
                                          i18n: i18n,
                                          ns: ns,
                                          skipContractConvert: false
                                      })}
                            </div>
                            <div className="caption"> {t('performance.tc.currentLeverage')}</div>
                        </div>
                    </div>

                    <div className="row-2">
                        <div className="coll-1">
                            <div className="amount">
                                {!auth.contractStatusData.canOperate
                                    ? '--'
                                    : PrecisionNumbers({
                                          amount: auth.contractStatusData ? auth.contractStatusData.nTCcb : new BigNumber(0),
                                          token: TokenSettings('TC'),
                                          decimals: 2,
                                          t: t,
                                          i18n: i18n,
                                          ns: ns,
                                          skipContractConvert: false
                                      })}
                            </div>
                            <div className="caption"> {t('performance.tc.totalInSystem')}</div>
                        </div>
                        <div className="coll-2">
                            <div className="amount">
                                {!auth.contractStatusData.canOperate
                                    ? '--'
                                    : PrecisionNumbers({
                                          amount: auth.contractStatusData ? auth.contractStatusData.getTCAvailableToRedeem : new BigNumber(0),
                                          token: TokenSettings('TC'),
                                          decimals: 2,
                                          t: t,
                                          i18n: i18n,
                                          ns: ns,
                                          skipContractConvert: false
                                      })}
                            </div>
                            <div className="caption"> {t('performance.tc.redeemable')}</div>
                        </div>
                    </div>
                </div>
            </div>
            {/* System Collateral */}
            <div className="perfCard perfCollateral">
                <div className="layout-card-title">
                    <h1>{t('performance.collateral.cardTitle')}</h1>
                </div>

                <div className="card-content">
                    <div className="row-1">
                        <div className="coll-1">
                            <div className="amount">
                                {!auth.contractStatusData.canOperate
                                    ? '--'
                                    : PrecisionNumbers({
                                          amount: collateralInUSD ? collateralInUSD : new BigNumber(0),
                                          token: TokenSettings('CA_0'),
                                          decimals: 2,
                                          t: t,
                                          i18n: i18n,
                                          ns: ns,
                                          skipContractConvert: true
                                      })}
                            </div>
                            <div className="caption">{t('performance.collateral.totalIn')}</div>
                        </div>
                        <div className="coll-2">
                            <div className="amount">
                                {!auth.contractStatusData.canOperate
                                    ? '--'
                                    : PrecisionNumbers({
                                          amount: auth.contractStatusData ? auth.contractStatusData.getCglb : new BigNumber(0),
                                          token: TokenSettings('CA_0'),
                                          decimals: 6,
                                          t: t,
                                          i18n: i18n,
                                          ns: ns,
                                          skipContractConvert: false
                                      })}
                            </div>
                            <div className="caption">{t('performance.collateral.globalCoverage')}</div>
                        </div>
                    </div>

                    <div className="row-2">
                        <CollateralAssets />
                    </div>
                </div>
            </div>
            {/* Pegged tokens Performance Table */}
            <div className="perfCard perfPegged">
                <div>
                    <TokensPegged />
                </div>
            </div>
        </div>
    );
}
