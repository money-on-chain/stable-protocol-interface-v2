import React, { useContext, useState, useEffect } from 'react';
import { Col, Row } from 'antd';

import { useProjectTranslation } from '../../helpers/translations';
import { AuthenticateContext } from '../../context/Auth';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { TokenSettings } from '../../helpers/currencies';
import settings from '../../settings/settings.json';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from '../../helpers/Formats';

export default function Performance(props) {

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
        <div className="Performance">

            <Row gutter={24} className="row-section">
                <Col span={12}>

                    <div className="card-system-status">

                        <div className="title">
                            <h1>System Status</h1>
                        </div>

                        <div className="card-content">

                            <div className="coll-1">
                                <div className="stat-text">The system is in optimal condition</div>
                                <div className="detailed-view"> <a href="#">See detailed view</a></div>
                            </div>
                            <div className="coll-2">

                                <div className="stat-icon"> <i className="icon-status-success display-block"></i> Fully Operational</div>
                                <div className="block-info">Showing block {auth.contractStatusData.blockHeight}</div>

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
                                {PrecisionNumbers({
                                    amount: auth.contractStatusData.nACcb,
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
                            <h1><i className="icon-token-tc display-block"></i> Go Turbo</h1>
                        </div>

                        <div className="card-content">

                            <div className="row-1">
                                <div className="coll-1">
                                    <div className="amount">
                                        {PrecisionNumbers({
                                            amount: auth.contractStatusData.getPTCac,
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
                                        {PrecisionNumbers({
                                            amount: auth.contractStatusData.getLeverageTC,
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
                                        {PrecisionNumbers({
                                            amount: auth.contractStatusData.nTCcb,
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
                                        {PrecisionNumbers({
                                            amount: auth.contractStatusData.getTCAvailableToRedeem,
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
                                    <div className="amount">{PrecisionNumbers({
                                        amount: auth.contractStatusData.nACcb,
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
                                        {PrecisionNumbers({
                                            amount: auth.contractStatusData.getCglb,
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

                                <div className="list-tokens">

                                    <div className="row-token">

                                        <div className="coll-1">
                                            <div className="token"> <i className="icon-token-ca_0 display-block"></i> Dollar On Chain (DOC)</div>
                                        </div>
                                        <div className="coll-2">
                                            <div className="amount-token">
                                                {PrecisionNumbers({
                                                    amount: auth.contractStatusData.getACBalance[0],
                                                    token: TokenSettings('CA_0'),
                                                    decimals: 2,
                                                    t: t,
                                                    i18n: i18n,
                                                    ns: ns,
                                                    skipContractConvert: false
                                                })}
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row-token">

                                        <div className="coll-1">
                                            <div className="token"> <i className="icon-token-ca_1 display-block"></i> RIF On Chain (DOC)</div>
                                        </div>
                                        <div className="coll-2">
                                            <div className="amount-token">
                                                {PrecisionNumbers({
                                                    amount: auth.contractStatusData.getACBalance[1],
                                                    token: TokenSettings('CA_1'),
                                                    decimals: 2,
                                                    t: t,
                                                    i18n: i18n,
                                                    ns: ns,
                                                    skipContractConvert: false
                                                })}
                                            </div>
                                        </div>

                                    </div>


                                </div>


                            </div>

                        </div>


                    </div>

                </Col>
            </Row>

            <Row gutter={24} className="row-section">
                <Col span={12}>
                    <div className="card-tps">

                        <div className="title">
                            <h1>Tokens pegged</h1>
                        </div>

                        <div className="card-content">

                            <div className="row-1">

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

                            <div className="row-2">

                                <div className="list-tokens">

                                    <div className="row-token">

                                        <div className="coll-1">
                                            <div className="token"> <i className="icon-token-tp_0 display-block"></i> Peso Argentino (FARS)</div>
                                        </div>
                                        <div className="coll-2">
                                            <div className="amount-token">
                                                {PrecisionNumbers({
                                                    amount: auth.contractStatusData.pegContainer[0],
                                                    token: TokenSettings('TP_0'),
                                                    decimals: 2,
                                                    t: t,
                                                    i18n: i18n,
                                                    ns: ns,
                                                    skipContractConvert: false
                                                })}
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row-token">

                                        <div className="coll-1">
                                            <div className="token"> <i className="icon-token-tp_1 display-block"></i> Peso Mexicano (FMXN)</div>
                                        </div>
                                        <div className="coll-2">
                                            <div className="amount-token">
                                                {PrecisionNumbers({
                                                    amount: auth.contractStatusData.pegContainer[1],
                                                    token: TokenSettings('TP_1'),
                                                    decimals: 2,
                                                    t: t,
                                                    i18n: i18n,
                                                    ns: ns,
                                                    skipContractConvert: false
                                                })}
                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </div>


                        </div>

                    </div>


                </Col>

                <Col span={12}>
                </Col>
            </Row>



        </div>
    );
}
