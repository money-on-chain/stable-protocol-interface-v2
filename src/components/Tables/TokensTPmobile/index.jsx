import React, { useContext, useEffect, useState } from 'react';
import { Skeleton, Table } from 'antd';
import BigNumber from 'bignumber.js';

import { useProjectTranslation } from '../../../helpers/translations';
import { AuthenticateContext } from '../../../context/Auth';
import { PrecisionNumbers } from '../../PrecisionNumbers';
import { fromContractPrecisionDecimals } from '../../../helpers/Formats';
import settings from '../../../settings/settings.json';
import { ConvertPeggedTokenPrice } from '../../../helpers/currencies';


export default function Tokens(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (auth.contractStatusData) {
            setReady(true);
        }
    }, [auth]);

    const tokensData = [];
    // const columnsData = [];
    const columnsData = [{ title: 'Token', dataIndex: 'details' }];

    // Columns
    // ProvideColumnsTP.forEach(function (dataItem) {
    //     columnsData.push({
    //         title: t(`portfolio.tokens.TP.columns.${dataItem.dataIndex}`, {
    //             ns: ns
    //         }),
    //         dataIndex: dataItem.dataIndex,
    //         align: dataItem.align,
    //         width: dataItem.width
    //     });
    // });

    // Rows
    auth.contractStatusData &&
        auth.userBalanceData &&
        settings.tokens.TP.forEach(function (dataItem) {
            const balance = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.userBalanceData.TP[dataItem.key].balance,
                    settings.tokens.TP[dataItem.key].decimals
                )
            );

            let price = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.PP_TP[dataItem.key],
                    settings.tokens.TP[dataItem.key].decimals
                )
            );
            price = ConvertPeggedTokenPrice(auth, dataItem.key, price);
            const balanceUSD = balance.div(price);

            // variation
            let priceHistory = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.historic.PP_TP[dataItem.key],
                    settings.tokens.TP[dataItem.key].decimals
                )
            );
            priceHistory = ConvertPeggedTokenPrice(auth, dataItem.key, priceHistory);

            const priceDelta = price.minus(priceHistory);
            const variation = priceDelta.abs().div(priceHistory).times(100);

            let signPriceDelta = '';
            if (priceDelta.gt(0)) signPriceDelta = '+';

            const priceDeltaFormat = priceDelta.toFormat(
                2,
                BigNumber.ROUND_UP,
                { decimalSeparator: '.', groupSeparator: ',' }
            );
            const getSign = () => {
                if (priceDelta.isZero()) {
                    return '';
                }
                if (priceDelta.isPositive()) {
                    return '+';
                }
                return '-';
            };
            const variationFormat = variation.toFormat(2, BigNumber.ROUND_UP, {
                decimalSeparator: '.',
                groupSeparator: ','
            });

            tokensData.push({
                key: dataItem.key,
                details: (
                    <div className="token__contents">
                        <div className="token">
                            <div
                                className={`icon-token-tp_${dataItem.key}`}
                            ></div>
                            <span className="token__name">
                                {t(
                                    `portfolio.tokens.TP.rows.${dataItem.key}.title`,
                                    {
                                        ns: ns
                                    }
                                )}
                            </span>
                            <span className="token__ticker">
                                {t(
                                    `portfolio.tokens.TP.rows.${dataItem.key}.symbol`,
                                    {
                                        ns: ns
                                    }
                                )}
                            </span>
                        </div>
                        <div className="token__details">
                            <div className="token__details__token">
                                <div className="token__data__small">
                                    {!auth.contractStatusData.canOperate
                                        ? '--'
                                        : PrecisionNumbers({
                                              amount: price,
                                              token: settings.tokens.TP[
                                                  dataItem.key
                                              ],
                                              decimals: 2,
                                              t: t,
                                              i18n: i18n,
                                              ns: ns,
                                              skipContractConvert: true
                                          })}
                                    <div className="token__label">
                                        tokens per usd
                                    </div>
                                </div>
                                <div className="token__data__small">
                                    {!auth.contractStatusData.canOperate ? (
                                        '--'
                                    ) : (
                                        <div>
                                            {`${getSign()} ${variationFormat} %`}
                                            <span
                                                className={`variation-indicator ${
                                                    getSign() === '+'
                                                        ? 'positive-indicator'
                                                        : getSign() === '-'
                                                          ? 'negative-indicator'
                                                          : 'neutral-indicator'
                                                }`}
                                            ></span>
                                        </div>
                                    )}
                                    <div className="token__label">
                                        Price Variation
                                    </div>
                                </div>
                            </div>
                            <div className="token__details__account">
                                <div className="token__data__big right">
                                    {PrecisionNumbers({
                                        amount: balance,
                                        token: settings.tokens.TP[dataItem.key],
                                        decimals: 2,
                                        t: t,
                                        i18n: i18n,
                                        ns: ns,
                                        skipContractConvert: true
                                    })}
                                    <div className="token__label right">
                                        Balance
                                    </div>
                                </div>
                                <div className="token__data__small right">
                                    {!auth.contractStatusData.canOperate
                                        ? '--'
                                        : PrecisionNumbers({
                                              amount: balanceUSD,
                                              token: settings.tokens.TP[
                                                  dataItem.key
                                              ],
                                              decimals: 3,
                                              t: t,
                                              i18n: i18n,
                                              ns: ns,
                                              skipContractConvert: true
                                          })}
                                    <div className="token__label right">
                                        balance in usd
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            });
        });

    return (
        <div className="tokens__table__mobile">
            <h1>Pegged Tokens</h1>
            {ready ? <Table
                columns={columnsData}
                dataSource={tokensData}
                pagination={false}
                showHeader={false}
                // scroll={{ y: '100%' }}
            /> : <Skeleton active />}
        </div>
    );
}
