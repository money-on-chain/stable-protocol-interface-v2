import React, { useContext, useState, useEffect } from 'react';
import { Col, Row } from 'antd';

import { useProjectTranslation } from '../../helpers/translations';
import { AuthenticateContext } from '../../context/Auth';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { TokenSettings } from '../../helpers/currencies';
import CollateralAssets from './collateral';
import TokensPegged from './tokenspegged';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from '../../helpers/Formats';
import settings from '../../settings/settings.json';

export default function Performance(props) {

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const globalCoverage = new BigNumber(
        fromContractPrecisionDecimals(
            auth.contractStatusData.getCglb,
            settings.tokens.CA[0].decimals
        )
    );

    const calcCtargemaCA = new BigNumber(
        fromContractPrecisionDecimals(
            auth.contractStatusData.calcCtargemaCA,
            settings.tokens.CA[0].decimals
        )
    );

    const liqThrld = new BigNumber(
        fromContractPrecisionDecimals(
            auth.contractStatusData.liqThrld,
            settings.tokens.CA[0].decimals
        )
    );

    const protThrld = new BigNumber(
        fromContractPrecisionDecimals(
            auth.contractStatusData.protThrld,
            settings.tokens.CA[0].decimals
        )
    );

    let statusIcon = '';
    let statusLabel = '--';
    let statusText = '--';

    if (globalCoverage.gt(calcCtargemaCA)) {
        statusIcon = 'icon-status-success';
        statusLabel = t("performance.status.statusTitleFull");
        statusText = t("performance.status.statusDescriptionFull");
    } else if (globalCoverage.gt(protThrld) && globalCoverage.lte(calcCtargemaCA)) {
        statusIcon = 'icon-status-warning';
        statusLabel = t("performance.status.statusTitleWarning");
        statusText = t("performance.status.statusDescriptionWarning");
    } else if (globalCoverage.gt(liqThrld) && globalCoverage.lte(protThrld)) {
        statusIcon = 'icon-status-alert';
        statusLabel = t("performance.status.statusTitleAlert");
        statusText = t("performance.status.statusDescriptionAlert");
    }

    if (auth.contractStatusData.liquidated) {
        statusIcon = 'icon-status-alert';
        statusLabel = t("performance.status.statusTitle:Liquidated");
        statusText = t("performance.status.statusDescriptionLiquidated");
    }

    if (auth.contractStatusData.paused) {
        statusIcon = 'icon-status-alert';
        statusLabel = t("performance.status.statusTitlePaused");
        statusText = t("performance.status.statusDescriptionPaused");
    }

    return (
        <div className="Performance">

            <Row gutter={24} className="row-section">
                <Col span={12}>

                    <div className="card-system-status">

                        <div className="title">
                            <h1>{t("performance.status.cardTitle")}</h1>
                        </div>

                        <div className="card-content">

                            <div className="coll-1">
                                <div className="stat-text">{statusText}</div>
                            </div>
                            <div className="coll-2">

                                <div className="stat-icon"> <i className={`${statusIcon} display-block`}></i> {statusLabel}</div>
                                <div className="block-info">{t("performance.status.showingBlock")} {auth.contractStatusData ? BigInt(auth.contractStatusData.blockHeight).toString() : '--'}</div>

                            </div>

                        </div>

                    </div>

                </Col>
                <Col span={12}>
                    <div className="card-tvl">

                        <div className="title">
                            <h1>{t("performance.tvl.cardTitle")}</h1>
                        </div>

                        <div className="card-content">

                            <div className="big-number">
                                {PrecisionNumbers({
                                    amount: auth.contractStatusData ? auth.contractStatusData.nACcb : new BigNumber(0),
                                    token: TokenSettings('CA_0'),
                                    decimals: 2,
                                    t: t,
                                    i18n: i18n,
                                    ns: ns,
                                    skipContractConvert: false
                                })}
                            </div>

                            <div className="caption">
                                {t("performance.tvl.expressedIn")}
                            </div>

                        </div>



                    </div>

                </Col>
            </Row>

            <Row gutter={24} className="row-section">
                <Col span={12}>

                    <div className="card-tc">

                        <div className="title">
                            <h1><i className="icon-token-tc display-block"></i> {t(`exchange.tokens.TC.label`, {ns: ns})}</h1>
                        </div>

                        <div className="card-content">

                            <div className="row-1">
                                <div className="coll-1">
                                    <div className="amount">
                                        {PrecisionNumbers({
                                            amount: auth.contractStatusData ? auth.contractStatusData.getPTCac : new BigNumber(0),
                                            token: TokenSettings('TC'),
                                            decimals: 8,
                                            t: t,
                                            i18n: i18n,
                                            ns: ns,
                                            skipContractConvert: false
                                        })}
                                    </div>
                                    <div className="caption">{t("performance.tc.priceIn")}</div>
                                </div>
                                <div className="coll-2">
                                    <div className="amount">
                                        {PrecisionNumbers({
                                            amount: auth.contractStatusData ? auth.contractStatusData.getLeverageTC : new BigNumber(0),
                                            token: TokenSettings('TC'),
                                            decimals: 8,
                                            t: t,
                                            i18n: i18n,
                                            ns: ns,
                                            skipContractConvert: false
                                        })}
                                    </div>
                                    <div className="caption">{t("performance.tc.currentLeverage")}</div>
                                </div>
                            </div>

                            <div className="row-2">

                                <div className="coll-1">
                                    <div className="amount">
                                        {PrecisionNumbers({
                                            amount: auth.contractStatusData ? auth.contractStatusData.nTCcb : new BigNumber(0),
                                            token: TokenSettings('TC'),
                                            decimals: 2,
                                            t: t,
                                            i18n: i18n,
                                            ns: ns,
                                            skipContractConvert: false
                                        })}
                                    </div>
                                    <div className="caption">{t("performance.tc.totalInSystem")}</div>
                                </div>
                                <div className="coll-2">
                                    <div className="amount">
                                        {PrecisionNumbers({
                                            amount: auth.contractStatusData ? auth.contractStatusData.getTCAvailableToRedeem : new BigNumber(0),
                                            token: TokenSettings('TC'),
                                            decimals: 2,
                                            t: t,
                                            i18n: i18n,
                                            ns: ns,
                                            skipContractConvert: false
                                        })}
                                    </div>
                                    <div className="caption">{t("performance.tc.redeemable")}</div>
                                </div>

                            </div>


                        </div>

                    </div>

                </Col>

                <Col span={12}>

                    <div className="card-collateral">

                        <div className="title">
                            <h1>{t("performance.collateral.cardTitle")}</h1>
                        </div>

                        <div className="card-content">

                            <div className="row-1">

                                <div className="coll-1">
                                    <div className="amount">{PrecisionNumbers({
                                        amount: auth.contractStatusData ? auth.contractStatusData.nACcb : new BigNumber(0),
                                        token: TokenSettings('CA_0'),
                                        decimals: 2,
                                        t: t,
                                        i18n: i18n,
                                        ns: ns,
                                        skipContractConvert: false
                                    })}</div>
                                    <div className="caption">{t("performance.collateral.totalIn")}</div>
                                </div>
                                <div className="coll-2">
                                    <div className="amount">
                                        {PrecisionNumbers({
                                            amount: auth.contractStatusData ? auth.contractStatusData.getCglb : new BigNumber(0),
                                            token: TokenSettings('CA_0'),
                                            decimals: 6,
                                            t: t,
                                            i18n: i18n,
                                            ns: ns,
                                            skipContractConvert: false
                                        })}
                                    </div>
                                    <div className="caption">{t("performance.collateral.globalCoverage")}</div>
                                </div>

                            </div>

                            <div className="row-2">

                                <CollateralAssets />

                            </div>

                        </div>


                    </div>

                </Col>
            </Row>

            <Row gutter={24} className="row-section">
                <Col span={24}>

                    <TokensPegged />

                </Col>

                <Col span={12}>
                </Col>
            </Row>



        </div>
    );
}
