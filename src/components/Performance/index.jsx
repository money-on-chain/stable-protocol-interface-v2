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
        statusLabel = 'Fully Operational';
        statusText = 'The system is in optimal condition';
    } else if (globalCoverage.gt(protThrld) && globalCoverage.lte(calcCtargemaCA)) {
        statusIcon = 'icon-status-warning';
        statusLabel = 'Partially Operational';
        statusText = 'Token Collateral cannot be redeemed. Token Pegged cannot be minted';
    } else if (globalCoverage.gt(liqThrld) && globalCoverage.lte(protThrld)) {
        statusIcon = 'icon-status-alert';
        statusLabel = 'Protected Mode';
        statusText = 'No operations allowed';
    }

    if (auth.contractStatusData.liquidated) {
        statusIcon = 'icon-status-alert';
        statusLabel = 'Liquidated';
        statusText = 'No operations allowed';
    }

    if (auth.contractStatusData.paused) {
        statusIcon = 'icon-status-alert';
        statusLabel = 'Paused';
        statusText = 'The contract is paused. No operations allowed';
    }

    if (!auth.contractStatusData.canOperate) {
        statusIcon = 'icon-status-alert';
        statusLabel = 'Cannot operate';
        statusText = 'One or more contracts are temporarily unavailable. Please try again later.';
    }

    return (
        <div className="Performance">

            <Row gutter={24} className="row-section">
                <Col span={12}>

                    <div className="card-system-status">

                        <div className="title">
                            <h1>System Status</h1>
                        </div>

                        <div className="card-content">

                            <div className="coll-1">
                                <div className="stat-text">{statusText}</div>
                            </div>
                            <div className="coll-2">

                                <div className="stat-icon"> <i className={`${statusIcon} display-block`}></i> {statusLabel}</div>
                                <div className="block-info">Showing block {auth.contractStatusData ? BigInt(auth.contractStatusData.blockHeight).toString() : '--'}</div>

                            </div>

                        </div>

                    </div>

                </Col>
                <Col span={12}>
                    <div className="card-tvl">

                        <div className="title">
                            <h1>Total Value Lock</h1>
                        </div>

                        <div className="card-content">

                            <div className="big-number">
                                {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
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
                                Expressed in USD
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
                                        {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                                            amount: auth.contractStatusData ? auth.contractStatusData.getPTCac : new BigNumber(0),
                                            token: TokenSettings('TC'),
                                            decimals: 8,
                                            t: t,
                                            i18n: i18n,
                                            ns: ns,
                                            skipContractConvert: false
                                        })}
                                    </div>
                                    <div className="caption"> Price in USD</div>
                                </div>
                                <div className="coll-2">
                                    <div className="amount">
                                        {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                                            amount: auth.contractStatusData ? auth.contractStatusData.getLeverageTC : new BigNumber(0),
                                            token: TokenSettings('TC'),
                                            decimals: 8,
                                            t: t,
                                            i18n: i18n,
                                            ns: ns,
                                            skipContractConvert: false
                                        })}
                                    </div>
                                    <div className="caption"> Current Leverage</div>
                                </div>
                            </div>

                            <div className="row-2">

                                <div className="coll-1">
                                    <div className="amount">
                                        {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                                            amount: auth.contractStatusData ? auth.contractStatusData.nTCcb : new BigNumber(0),
                                            token: TokenSettings('TC'),
                                            decimals: 2,
                                            t: t,
                                            i18n: i18n,
                                            ns: ns,
                                            skipContractConvert: false
                                        })}
                                    </div>
                                    <div className="caption"> Total in the system</div>
                                </div>
                                <div className="coll-2">
                                    <div className="amount">
                                        {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                                            amount: auth.contractStatusData ? auth.contractStatusData.getTCAvailableToRedeem : new BigNumber(0),
                                            token: TokenSettings('TC'),
                                            decimals: 2,
                                            t: t,
                                            i18n: i18n,
                                            ns: ns,
                                            skipContractConvert: false
                                        })}
                                    </div>
                                    <div className="caption"> Available to redeem</div>
                                </div>

                            </div>


                        </div>

                    </div>

                </Col>

                <Col span={12}>

                    <div className="card-collateral">

                        <div className="title">
                            <h1>Collateral</h1>
                        </div>

                        <div className="card-content">

                            <div className="row-1">

                                <div className="coll-1">
                                    <div className="amount">{(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                                        amount: auth.contractStatusData ? auth.contractStatusData.nACcb : new BigNumber(0),
                                        token: TokenSettings('CA_0'),
                                        decimals: 2,
                                        t: t,
                                        i18n: i18n,
                                        ns: ns,
                                        skipContractConvert: false
                                    })}</div>
                                    <div className="caption">Total Collateral in USD</div>
                                </div>
                                <div className="coll-2">
                                    <div className="amount">
                                        {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                                            amount: auth.contractStatusData ? auth.contractStatusData.getCglb : new BigNumber(0),
                                            token: TokenSettings('CA_0'),
                                            decimals: 6,
                                            t: t,
                                            i18n: i18n,
                                            ns: ns,
                                            skipContractConvert: false
                                        })}
                                    </div>
                                    <div className="caption">Global coverage</div>
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
