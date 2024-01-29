import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'antd';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import settings from '../../../settings/settings.json';
import { PrecisionNumbers } from '../../PrecisionNumbers';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from '../../../helpers/Formats';
import { ProvideColumnsCA } from '../../../helpers/tokensTables';


export default function Tokens(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const tokensData = [];
    const columnsData = [];

    // Columns
    ProvideColumnsCA().forEach(function (dataItem) {
        columnsData.push({
            title: t(`portfolio.tokens.CA.columns.${dataItem.dataIndex}`, {
                ns: ns
            }),
            dataIndex: dataItem.dataIndex,
            align: dataItem.align,
            width: dataItem.width
        });
    });

    // Tokens CA
    const TokensCA = settings.tokens.CA;
    let balance;
    let price;
    let balanceUSD;

    // Iterate Tokens CA
    let count = 0;
    auth.contractStatusData &&
        auth.userBalanceData &&
        TokensCA.forEach(function (dataItem) {
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

            // variation
            const priceHistory = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.historic.PP_CA[dataItem.key],
                    settings.tokens.CA[dataItem.key].decimals
                )
            );
            const priceDelta = price.minus(priceHistory);
            const variation = priceDelta.abs().div(priceHistory).times(100);

            const priceDeltaFormat = priceDelta.toFormat(t(`portfolio.tokens.CA.rows.${dataItem.key}.price_decimals`), BigNumber.ROUND_UP, {
                decimalSeparator: '.',
                groupSeparator: ','
            });
            const variationFormat = variation.toFormat(2, BigNumber.ROUND_UP, {
                decimalSeparator: '.',
                groupSeparator: ','
            });

            tokensData.push({
                key: dataItem.key,
                name: (
                    <div className="item-token">
                        <i className={`icon-token-ca_${dataItem.key}`}></i>{' '}
                        <span className="token-description">
                            {t(`portfolio.tokens.CA.rows.${dataItem.key}.title`, {
                                ns: ns
                            })}
                        </span>
                    </div>
                ),
                price: (
                    <div>
                        {PrecisionNumbers({
                            amount: auth.contractStatusData.PP_CA[dataItem.key],
                            token: settings.tokens.CA[dataItem.key],
                            decimals: t(`portfolio.tokens.CA.rows.${dataItem.key}.price_decimals`),
                            t: t,
                            i18n: i18n,
                            ns: ns
                        })}
                    </div>
                ),
                variation: `${priceDeltaFormat} (${variationFormat} %)`,
                balance: (
                    <div>
                        {PrecisionNumbers({
                            amount: auth.userBalanceData.CA[dataItem.key]
                                .balance,
                            token: settings.tokens.CA[dataItem.key],
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns
                        })}
                    </div>
                ),
                usd: (
                    <div>
                        {PrecisionNumbers({
                            amount: balanceUSD,
                            token: settings.tokens.CA[dataItem.key],
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                    </div>
                )
            });
            count += 1;
        });

    // Token TC
    if (auth.contractStatusData && auth.userBalanceData) {
        balance = new BigNumber(
            fromContractPrecisionDecimals(
                auth.userBalanceData.TC.balance,
                settings.tokens.TC.decimals
            )
        );
        const priceTEC = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.getPTCac,
                settings.tokens.TC.decimals
            )
        );
        const priceCA = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.PP_CA[0],
                settings.tokens.CA[0].decimals
            )
        );
        price = priceTEC.times(priceCA);
        balanceUSD = balance.times(price);

        // variation
        const priceHistory = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.historic.getPTCac,
                settings.tokens.TC.decimals
            )
        );
        const priceDelta = price.minus(priceHistory);
        const variation = priceDelta.abs().div(priceHistory).times(100);

        const itemIndex = count;

        const priceDeltaFormat = priceDelta.toFormat(t(`portfolio.tokens.CA.rows.${itemIndex}.price_decimals`), BigNumber.ROUND_UP, {
            decimalSeparator: '.',
            groupSeparator: ','
        });
        const variationFormat = variation.toFormat(2, BigNumber.ROUND_UP, {
            decimalSeparator: '.',
            groupSeparator: ','
        });

        tokensData.push({
            key: itemIndex,
            name: (
                <div className="item-token">
                    <i className="icon-token-tc"></i>{' '}
                    <span className="token-description">
                        {t(`portfolio.tokens.CA.rows.${itemIndex}.title`, {
                            ns: ns
                        })}
                    </span>
                </div>
            ),
            price: (
                <div>
                    {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                        amount: price,
                        token: settings.tokens.TC,
                        decimals: t(`portfolio.tokens.CA.rows.${itemIndex}.price_decimals`),
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: true
                    })}
                </div>
            ),
            variation: `${priceDeltaFormat} (${variationFormat} %)`,
            balance: (
                <div>
                    {PrecisionNumbers({
                        amount: auth.userBalanceData.TC.balance,
                        token: settings.tokens.TC,
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns
                    })}
                </div>
            ),
            usd: (
                <div>
                    {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                        amount: balanceUSD,
                        token: settings.tokens.TC,
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: true
                    })}
                </div>
            )
        });

        count += 1;
    }

    // Token TP only in Roc
    if (auth.contractStatusData && auth.userBalanceData && settings.project === 'roc') {
        balance = new BigNumber(
            fromContractPrecisionDecimals(
                auth.userBalanceData.TP[0].balance,
                settings.tokens.TP[0].decimals
            )
        );
        price = new BigNumber(1);
        balanceUSD = balance.times(price);

        // variation
        const priceHistory = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.historic.PP_TP[0],
                settings.tokens.TP[0].decimals
            )
        );
        const priceDelta = price.minus(priceHistory);
        const variation = priceDelta.abs().div(priceHistory).times(100);

        const priceDeltaFormat = priceDelta.toFormat(2, BigNumber.ROUND_UP, {
            decimalSeparator: '.',
            groupSeparator: ','
        });
        const variationFormat = variation.toFormat(2, BigNumber.ROUND_UP, {
            decimalSeparator: '.',
            groupSeparator: ','
        });

        const itemIndex = count;

        tokensData.push({
            key: itemIndex,
            name: (
                <div className="item-token">
                    <i className="icon-token-tp_0"></i>{' '}
                    <span className="token-description">
                        {t(`portfolio.tokens.CA.rows.${itemIndex}.title`, {
                            ns: ns
                        })}
                    </span>
                </div>
            ),
            price: (
                <div>
                    {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                        amount: price,
                        token: settings.tokens.TP[0],
                        decimals: t(`portfolio.tokens.CA.rows.${itemIndex}.price_decimals`),
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: true
                    })}
                </div>
            ),
            variation: '--',
            balance: (
                <div>
                    {PrecisionNumbers({
                        amount: auth.userBalanceData.TP[0].balance,
                        token: settings.tokens.TP[0],
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns
                    })}
                </div>
            ),
            usd: (
                <div>
                    {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                        amount: balanceUSD,
                        token: settings.tokens.TP[0],
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: true
                    })}
                </div>
            )
        });

        count += 1;
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

        // variation
        const priceHistory = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.historic.PP_COINBASE,
                settings.tokens.COINBASE.decimals
            )
        );
        const priceDelta = price.minus(priceHistory);
        const variation = priceDelta.abs().div(priceHistory).times(100);

        const itemIndex = count;

        const priceDeltaFormat = priceDelta.toFormat(t(`portfolio.tokens.CA.rows.${itemIndex}.price_decimals`), BigNumber.ROUND_UP, {
            decimalSeparator: '.',
            groupSeparator: ','
        });
        const variationFormat = variation.toFormat(2, BigNumber.ROUND_UP, {
            decimalSeparator: '.',
            groupSeparator: ','
        });

        tokensData.push({
            key: itemIndex,
            name: (
                <div className="item-token">
                    <i className="icon-token-coinbase"></i>{' '}
                    <span className="token-description">
                        {t(`portfolio.tokens.CA.rows.${itemIndex}.title`, {
                            ns: ns
                        })}
                    </span>
                </div>
            ),
            price: (
                <div>
                    {PrecisionNumbers({
                        amount: auth.contractStatusData.PP_COINBASE,
                        token: settings.tokens.COINBASE,
                        decimals: t(`portfolio.tokens.CA.rows.${itemIndex}.price_decimals`),
                        t: t,
                        i18n: i18n,
                        ns: ns
                    })}
                </div>
            ),
            variation: `${priceDeltaFormat} (${variationFormat} %)`,
            balance: (
                <div>
                    {PrecisionNumbers({
                        amount: auth.userBalanceData.coinbase,
                        token: settings.tokens.COINBASE,
                        decimals: 6,
                        t: t,
                        i18n: i18n,
                        ns: ns
                    })}
                </div>
            ),
            usd: (
                <div>
                    {PrecisionNumbers({
                        amount: balanceUSD,
                        token: settings.tokens.COINBASE,
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: true
                    })}
                </div>
            )
        });
    }

    return (
        <Table
            columns={columnsData}
            dataSource={tokensData}
            pagination={false}
            scroll={{ y: 240 }}
        />
    );
}
