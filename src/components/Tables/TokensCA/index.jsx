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
    // let balanceRIF;
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

            //TODO fetch the correct value when defined if include or not
            //balanceRIF = balanceUSD * 0.1;

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
                name: (
                    <div className="item-token">
                        <i className={`icon-token-ca_${dataItem.key}`}></i>{' '}
                        <span className="token-description">
                            {t(`portfolio.tokens.CA.rows.${dataItem.key}.title`, {
                                ns: ns
                            })}
                        </span>
                        <span className="token-symbol">
                            {t(`portfolio.tokens.CA.rows.${dataItem.key}.symbol`, {
                                ns: ns
                            })}
                        </span>
                    </div>
                ),
                price: (
                    <div>
                        {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                            amount: auth.contractStatusData.PP_CA[dataItem.key],
                            token: settings.tokens.CA[dataItem.key],
                            decimals: t(`portfolio.tokens.CA.rows.${dataItem.key}.price_decimals`),
                            t: t,
                            i18n: i18n,
                            ns: ns
                        })}
                    </div>
                ),
                variation:
                    (!auth.contractStatusData.canOperate) ? '--' : (
                    <div>
                        {`${getSign()} ${variationFormat} %`}
                        <span className={
                            `variation-indicator ${getSign() === '+' ? 'positive-indicator' :
                                getSign() === '-' ? 'negative-indicator' :
                                    'neutral-indicator'
                            }`
                        }></span>
                    </div>),
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
                // rif : (
                //     <div>
                //         {PrecisionNumbers({
                //             amount: balanceRIF,
                //             token: settings.tokens.CA[dataItem.key],
                //             decimals: 6,
                //             t: t,
                //             i18n: i18n,
                //             ns: ns
                //         })}
                //     </div>
                // ),
                usd: (
                    <div className="item-usd">
                        {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
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
        ).times(priceCA);

        const priceDelta = price.minus(priceHistory);

        const variation = price.minus(priceHistory).div(priceHistory).times(100);

        const itemIndex = count;

        const getSign = () => {
            if (priceDelta.isZero()) {
                return '';
            }
            if (priceDelta.isPositive()) {
                return '+';
            }
            return '-';
        };
        const variationFormat = variation.abs().toFormat(2, BigNumber.ROUND_UP, {
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
                    <span className="token-symbol">
                        {t(`portfolio.tokens.CA.rows.${itemIndex}.symbol`, {
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
            variation:
                    (!auth.contractStatusData.canOperate) ? '--' : (
                    <div>
                        {`${getSign()} ${variationFormat} %`}
                        <span className={
                            `variation-indicator ${getSign() === '+' ? 'positive-indicator' :
                                getSign() === '-' ? 'negative-indicator' :
                                    'neutral-indicator'
                            }`
                        }></span>
                    </div>),
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
                <div className="item-usd">
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
                    <span className="token-symbol">
                        {t(`portfolio.tokens.CA.rows.${itemIndex}.symbol`, {
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
            variation:
                    (!auth.contractStatusData.canOperate) ? '--' : (
                    <div>
                        {'0,00 %'}
                        <span className={'variation-indicator neutral-indicator'}></span>
                    </div>),
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
                <div className="item-usd">
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

    // TF
    if (auth.contractStatusData && auth.userBalanceData) {
        balance = new BigNumber(
            fromContractPrecisionDecimals(
                auth.userBalanceData.FeeToken.balance,
                settings.tokens.TF.decimals
            )
        );
        price = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.PP_FeeToken,
                settings.tokens.TF.decimals
            )
        );
        balanceUSD = balance.times(price);

        // variation
        const priceHistory = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.historic.PP_FeeToken,
                settings.tokens.TF.decimals
            )
        );
        const priceDelta = price.minus(priceHistory);
        const variation = priceDelta.abs().div(priceHistory).times(100);

        const itemIndex = count;

        const priceDeltaFormat = priceDelta.toFormat(t(`portfolio.tokens.CA.rows.${itemIndex}.price_decimals`), BigNumber.ROUND_UP, {
            decimalSeparator: '.',
            groupSeparator: ','
        });
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
            key: itemIndex,
            name: (
                <div className="item-token">
                    <i className="icon-token-tf"></i>{' '}
                    <span className="token-description">
                        {t(`portfolio.tokens.CA.rows.${itemIndex}.title`, {
                            ns: ns
                        })}
                    </span>
                    <span className="token-symbol">
                        {t(`portfolio.tokens.CA.rows.${itemIndex}.symbol`, {
                            ns: ns
                        })}
                    </span>
                </div>
            ),
            price: (
                <div>
                    {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                        amount: auth.contractStatusData.PP_FeeToken,
                        token: settings.tokens.TF,
                        decimals: t(`portfolio.tokens.CA.rows.${itemIndex}.price_decimals`),
                        t: t,
                        i18n: i18n,
                        ns: ns
                    })}
                </div>
            ),
            variation:
                    (!auth.contractStatusData.canOperate) ? '--' : (
                    <div>
                        {`${getSign()} ${variationFormat} %`}
                        <span className={
                            `variation-indicator ${getSign() === '+' ? 'positive-indicator' :
                                getSign() === '-' ? 'negative-indicator' :
                                    'neutral-indicator'
                            }`
                        }></span>
                    </div>),
            balance: (
                <div>
                    {PrecisionNumbers({
                        amount: auth.userBalanceData.FeeToken.balance,
                        token: settings.tokens.TF,
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns
                    })}
                </div>
            ),
            usd: (
                <div className="item-usd">
                    {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                        amount: balanceUSD,
                        token: settings.tokens.TF,
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
            key: itemIndex,
            name: (
                <div className="item-token">
                    <i className="icon-token-coinbase"></i>{' '}
                    <span className="token-description">
                        {t(`portfolio.tokens.CA.rows.${itemIndex}.title`, {
                            ns: ns
                        })}
                    </span>
                    <span className="token-symbol">
                        {t(`portfolio.tokens.CA.rows.${itemIndex}.symbol`, {
                            ns: ns
                        })}
                    </span>
                </div>
            ),
            price: (
                <div>
                    {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                        amount: auth.contractStatusData.PP_COINBASE,
                        token: settings.tokens.COINBASE,
                        decimals: t(`portfolio.tokens.CA.rows.${itemIndex}.price_decimals`),
                        t: t,
                        i18n: i18n,
                        ns: ns
                    })}
                </div>
            ),
            variation:
                    (!auth.contractStatusData.canOperate) ? '--' : (
                    <div>
                        {`${getSign()} ${variationFormat} %`}
                        <span className={
                            `variation-indicator ${getSign() === '+' ? 'positive-indicator' :
                                getSign() === '-' ? 'negative-indicator' :
                                    'neutral-indicator'
                            }`
                        }></span>
                    </div>),
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
                <div className="item-usd">
                    {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
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
