import React, { useContext, useEffect, useState } from 'react';
import { Skeleton, Table } from 'antd';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import settings from '../../../settings/settings.json';
import { PrecisionNumbers } from '../../PrecisionNumbers';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from '../../../helpers/Formats';
import { ProvideColumnsCA } from '../../../helpers/tokensTables';
import NumericLabel from 'react-pretty-numbers';

export default function Tokens(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (auth.contractStatusData) {
            setReady(true);
        }
    }, [auth]);

    const portfTableHeight = getComputedStyle(document.querySelector(':root'))
        .getPropertyValue('--portfolioTokenHeight')
        .split('"')
        .join('');
    const portfPeggedHeight = getComputedStyle(document.querySelector(':root'))
        .getPropertyValue('--portfolioPeggedHeight')
        .split('"')
        .join('');
    const tokensData = [];
    const columnsData = [{ title: 'Token', dataIndex: 'details' }];
    console.log(columnsData);
    const params = Object.assign({
        shortFormat: true,
        justification: 'L',
        locales: i18n.languages[0],
        shortFormatMinValue: 1000000,
        commafy: true,
        shortFormatPrecision: 2,
        precision: 2,
        title: '',
        cssClass: ['display-inline']
    });
    // Columns
    // ProvideColumnsCA().forEach(function (dataItem) {
    //     columnsData.push({
    //         title: t(`portfolio.tokens.CA.columns.${dataItem.dataIndex}`, {
    //             ns: ns
    //         }),
    //         dataIndex: dataItem.dataIndex,
    //         align: dataItem.align,
    //         width: dataItem.width
    //     });
    // });

    // #region TOKEN CA
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

            const priceDeltaFormat = priceDelta.toFormat(
                t(`portfolio.tokens.CA.rows.${dataItem.key}.price_decimals`),
                BigNumber.ROUND_UP,
                {
                    decimalSeparator: '.',
                    groupSeparator: ','
                }
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
                decimalSeparator: t('numberFormat.decimalSeparator'),
                groupSeparator: t('numberFormat.thousandsSeparator')
            });

            tokensData.push({
                key: dataItem.key,
                details: (
                    <div className="token__contents">
                        <div className="token">
                            <div
                                className={`icon-token-ca_${dataItem.key} token__icon`}
                            ></div>
                            <span className="token__name">
                                {t(
                                    `portfolio.tokens.CA.rows.${dataItem.key}.title`,
                                    {
                                        ns: ns
                                    }
                                )}
                            </span>
                            <span className="token__ticker">
                                {t(
                                    `portfolio.tokens.CA.rows.${dataItem.key}.symbol`,
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
                                              amount: auth.contractStatusData
                                                  .PP_CA[dataItem.key],
                                              token: settings.tokens.CA[
                                                  dataItem.key
                                              ],
                                              decimals: t(
                                                  `portfolio.tokens.CA.rows.${dataItem.key}.price_decimals`
                                              ),
                                              t: t,
                                              i18n: i18n,
                                              ns: ns
                                          })}
                                    <div className="token__label">
                                        price in usd
                                    </div>
                                </div>
                                <div className="token__data__small">
                                    {!auth.contractStatusData.canOperate ? (
                                        '--'
                                    ) : (
                                        <div>
                                            {`${getSign()} `}
                                            <NumericLabel {...{ params }}>
                                                {variationFormat}
                                            </NumericLabel>
                                            {' %'}
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
                                        amount: auth.userBalanceData.CA[
                                            dataItem.key
                                        ].balance,
                                        token: settings.tokens.CA[dataItem.key],
                                        decimals: t(
                                            `portfolio.tokens.CA.rows.${dataItem.key}.balance_decimals`
                                        ),
                                        t: t,
                                        i18n: i18n,
                                        ns: ns
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
                                              token: settings.tokens.CA[
                                                  dataItem.key
                                              ],
                                              decimals: 2,
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
            count += 1;
        });

    // #endregion TOKEN CA

    // #region TOKEN TC
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

        const variation = price
            .minus(priceHistory)
            .div(priceHistory)
            .times(100);

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
        const variationFormat = variation
            .abs()
            .toFormat(2, BigNumber.ROUND_UP, {
                decimalSeparator: '.',
                groupSeparator: ','
            });

        tokensData.push({
            key: itemIndex,
            details: (
                <div className="token__contents">
                    <div className="token">
                        <div className="icon-token-tc token__icon"></div>
                        <span className="token__name">
                            {t(`portfolio.tokens.CA.rows.${itemIndex}.title`, {
                                ns: ns
                            })}
                        </span>
                        <span className="token__ticker">
                            {t(`portfolio.tokens.CA.rows.${itemIndex}.symbol`, {
                                ns: ns
                            })}
                        </span>
                    </div>
                    <div className="token__details">
                        <div className="token__details__token">
                            <div className="token__data__small">
                                {!auth.contractStatusData.canOperate
                                    ? '--'
                                    : PrecisionNumbers({
                                          amount: price,
                                          token: settings.tokens.TC,
                                          decimals: t(
                                              `portfolio.tokens.CA.rows.${itemIndex}.price_decimals`
                                          ),
                                          t: t,
                                          i18n: i18n,
                                          ns: ns,
                                          skipContractConvert: true
                                      })}
                                <div className="token__label">price in usd</div>
                            </div>
                            <div className="token__data__small">
                                {!auth.contractStatusData.canOperate ? (
                                    '--'
                                ) : (
                                    <div>
                                        {`${getSign()} `}
                                        <NumericLabel {...{ params }}>
                                            {variationFormat}
                                        </NumericLabel>
                                        {' %'}
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
                            {' '}
                            <div className="token__data__big right">
                                {PrecisionNumbers({
                                    amount: auth.userBalanceData.TC.balance,
                                    token: settings.tokens.TC,
                                    decimals: t(
                                        `portfolio.tokens.CA.rows.${itemIndex}.balance_decimals`
                                    ),
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
                                })}
                                <div className="token__label right">
                                    Balance
                                </div>
                            </div>{' '}
                            <div className="token__data__small right">
                                {!auth.contractStatusData.canOperate
                                    ? '--'
                                    : PrecisionNumbers({
                                          amount: balanceUSD,
                                          token: settings.tokens.TC,
                                          decimals: 2,
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

        count += 1;
    }
    // #endregion TOKEN TC

    // #region TOKEN TP - ONLY FOR ROC
    if (
        auth.contractStatusData &&
        auth.userBalanceData &&
        (settings.project === 'roc' ||
        settings.project === 'moc' ||
        settings.project === 'stablex')
    ) {
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
            details: (
                <div className="token__contents">
                    <div className="token">
                        <div className="icon-token-tp_0 token__icon"></div>{' '}
                        <span className="token__name">
                            {t(`portfolio.tokens.CA.rows.${itemIndex}.title`, {
                                ns: ns
                            })}
                        </span>
                        <span className="token__ticker">
                            {t(`portfolio.tokens.CA.rows.${itemIndex}.symbol`, {
                                ns: ns
                            })}
                        </span>
                    </div>
                    <div className="token__details">
                        <div className="token__details__token">
                            <div className="token__data__small">
                                {!auth.contractStatusData.canOperate
                                    ? '--'
                                    : PrecisionNumbers({
                                          amount: price,
                                          token: settings.tokens.TP[0],
                                          decimals: t(
                                              `portfolio.tokens.CA.rows.${itemIndex}.price_decimals`
                                          ),
                                          t: t,
                                          i18n: i18n,
                                          ns: ns,
                                          skipContractConvert: true
                                      })}
                                <div className="token__label">price in usd</div>
                            </div>
                            <div className="token__data__small">
                                {!auth.contractStatusData.canOperate ? (
                                    '--'
                                ) : (
                                    <div>
                                        <NumericLabel {...{ params }}>
                                            {0}
                                        </NumericLabel>
                                        {' %'}
                                        <span
                                            className={
                                                'variation-indicator neutral-indicator'
                                            }
                                        ></span>
                                    </div>
                                )}
                                <div className="token__label">
                                    Price Variation
                                </div>
                            </div>
                        </div>
                        <div className="token__details__account">
                            {' '}
                            <div className="token__data__big right">
                                {PrecisionNumbers({
                                    amount: auth.userBalanceData.TP[0].balance,
                                    token: settings.tokens.TP[0],
                                    decimals: 2,
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
                                })}
                                <div className="token__label right">
                                    Balance
                                </div>
                            </div>{' '}
                            <div className="token__data__small right">
                                {!auth.contractStatusData.canOperate
                                    ? '--'
                                    : PrecisionNumbers({
                                          amount: balanceUSD,
                                          token: settings.tokens.TP[0],
                                          decimals: 2,
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

        count += 1;
    }
    // #endregion TOKEN TP - ONLY FOR ROC

    // #region TF
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

        const priceDeltaFormat = priceDelta.toFormat(
            t(`portfolio.tokens.CA.rows.${itemIndex}.price_decimals`),
            BigNumber.ROUND_UP,
            {
                decimalSeparator: '.',
                groupSeparator: ','
            }
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
            key: itemIndex,
            details: (
                <div className="token__contents">
                    <div className="token">
                        <div className="icon-token-tf token__icon"></div>
                        <span className="token__name">
                            {t(`portfolio.tokens.CA.rows.${itemIndex}.title`, {
                                ns: ns
                            })}
                        </span>
                        <span className="token__ticker">
                            {t(`portfolio.tokens.CA.rows.${itemIndex}.symbol`, {
                                ns: ns
                            })}
                        </span>
                    </div>
                    <div className="token__details">
                        <div className="token__details__token">
                            <div className="token__data__small">
                                {!auth.contractStatusData.canOperate
                                    ? '--'
                                    : PrecisionNumbers({
                                          amount: auth.contractStatusData
                                              .PP_FeeToken,
                                          token: settings.tokens.TF,
                                          decimals: t(
                                              `portfolio.tokens.CA.rows.${itemIndex}.price_decimals`
                                          ),
                                          t: t,
                                          i18n: i18n,
                                          ns: ns
                                      })}
                                <div className="token__label">price in usd</div>
                            </div>
                            <div className="token__data__small">
                                {!auth.contractStatusData.canOperate ? (
                                    '--'
                                ) : (
                                    <div>
                                        {`${getSign()} `}
                                        <NumericLabel {...{ params }}>
                                            {variationFormat}
                                        </NumericLabel>
                                        {' %'}
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
                                    amount: auth.userBalanceData.FeeToken
                                        .balance,
                                    token: settings.tokens.TF,
                                    decimals: 2,
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
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
                                          token: settings.tokens.TF,
                                          decimals: 2,
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
        count += 1;
    }
    // #endregion TF

    // #region COINBASE
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

        const priceDeltaFormat = priceDelta.toFormat(
            t(`portfolio.tokens.CA.rows.${itemIndex}.price_decimals`),
            BigNumber.ROUND_UP,
            {
                decimalSeparator: '.',
                groupSeparator: ','
            }
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
            key: itemIndex,
            details: (
                <div className="token__contents">
                    <div className="token">
                        <div className="icon-token-coinbase token__icon"></div>
                        <span className="token__name">
                            {t(`portfolio.tokens.CA.rows.${itemIndex}.title`, {
                                ns: ns
                            })}
                        </span>
                        <span className="token__ticker">
                            {t(`portfolio.tokens.CA.rows.${itemIndex}.symbol`, {
                                ns: ns
                            })}
                        </span>
                    </div>
                    <div className="token__details">
                        <div className="token__details__token">
                            <div className="token__data__small">
                                {!auth.contractStatusData.canOperate
                                    ? '--'
                                    : PrecisionNumbers({
                                          amount: auth.contractStatusData
                                              .PP_COINBASE,
                                          token: settings.tokens.COINBASE,
                                          decimals: t(
                                              `portfolio.tokens.CA.rows.${itemIndex}.price_decimals`
                                          ),
                                          t: t,
                                          i18n: i18n,
                                          ns: ns
                                      })}
                                <div className="token__label">price in usd</div>
                            </div>
                            <div className="token__data__small">
                                {!auth.contractStatusData.canOperate ? (
                                    '--'
                                ) : (
                                    <div>
                                        {`${getSign()} `}
                                        <NumericLabel {...{ params }}>
                                            {variationFormat}
                                        </NumericLabel>
                                        {' %'}
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
                            {' '}
                            <div className="token__data__big right">
                                {PrecisionNumbers({
                                    amount: auth.userBalanceData.coinbase,
                                    token: settings.tokens.COINBASE,
                                    decimals: t(
                                        `portfolio.tokens.CA.rows.${itemIndex}.balance_decimals`
                                    ),
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
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
                                          token: settings.tokens.COINBASE,
                                          decimals: 2,
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
    }
    // #endregion COINBASE

    return (
        <div className="tokens__table__mobile">
            <h1>Tokens</h1>
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
