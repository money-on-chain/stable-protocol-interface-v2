import React, { useContext, useEffect, useState } from "react";
import { Table, Skeleton } from "antd";

import { AuthenticateContext } from "../../../context/Auth";
import { useProjectTranslation } from "../../../helpers/translations";
import settings from "../../../settings/settings.json";
import { PrecisionNumbers } from "../../PrecisionNumbers";
import BigNumber from "bignumber.js";
import { fromContractPrecisionDecimals } from "../../../helpers/Formats";
import NumericLabel from "react-pretty-numbers";
import { ConvertPeggedTokenPrice } from "../../../helpers/currencies";
import "./Styles.scss";

export default function PortfolioTable(props) {
    // Setup translation and authentication context
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Set component ready when contract status data is available
        if (auth.contractStatusData) {
            setReady(true);
        }
    }, [auth]);

    // Retrieve dynamic heights for tables from CSS variables
    const portfTableHeight = getComputedStyle(document.querySelector(":root"))
        .getPropertyValue("--portfolioTokenHeight")
        .split('"')
        .join("");
    const portfPeggedHeight = getComputedStyle(document.querySelector(":root"))
        .getPropertyValue("--portfolioPeggedHeight")
        .split('"')
        .join("");

    // Initialize arrays for token and column data
    const tokensData = [];
    const columnsData = [];
    var rowData = [];
    var data = [];

    // Setup parameters for numeric formatting
    const params = Object.assign({
        shortFormat: true,
        justification: "L",
        locales: i18n.languages[0],
        shortFormatMinValue: 1000000,
        commafy: true,
        shortFormatPrecision: 2,
        precision: 2,
        title: "",
        cssClass: ["display-inline"],
    });
    // PORA add column for renderRow at the beginning (temporary until renderRow is fully implemented)
    columnsData.push({ dataIndex: "renderRow", align: "center", width: 100 });

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
            // Convert balance to BigNumber with correct decimal precision
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

            const priceDeltaFormat = priceDelta.toFormat(
                t(`portfolio.tokens.CA.rows.${dataItem.key}.price_decimals`),
                BigNumber.ROUND_UP,
                {
                    decimalSeparator: ".",
                    groupSeparator: ",",
                }
            );
            const getSign = () => {
                if (priceDelta.isZero()) {
                    return "";
                }
                if (priceDelta.isPositive()) {
                    return "+";
                }
                return "-";
            };

            const variationFormat = variation.toFormat(2, BigNumber.ROUND_UP, {
                decimalSeparator: t("numberFormat.decimalSeparator"),
                groupSeparator: t("numberFormat.thousandsSeparator"),
            });

            // Add token data to tokensData array
            tokensData.push({
                key: dataItem.key,
                renderRow: (
                    <div className="table__row">
                        {/* Token icon, name and ticker */}
                        <div className="table__cell__name">
                            <div
                                className={`icon-token-ca_${dataItem.key} token__icon`}
                            ></div>
                            <span className="token__name">
                                {t(
                                    `portfolio.tokens.CA.rows.${dataItem.key}.title`,
                                    {
                                        ns: ns,
                                    }
                                )}
                            </span>
                            <span className="token__ticker">
                                {t(
                                    `portfolio.tokens.CA.rows.${dataItem.key}.symbol`,
                                    {
                                        ns: ns,
                                    }
                                )}
                            </span>
                        </div>
                        {/* Token price */}
                        <div className="table__cell__price">
                            {!auth.contractStatusData.canOperate
                                ? "--"
                                : PrecisionNumbers({
                                      amount: auth.contractStatusData.PP_CA[
                                          dataItem.key
                                      ],
                                      token: settings.tokens.CA[dataItem.key],
                                      decimals: t(
                                          `portfolio.tokens.CA.rows.${dataItem.key}.price_decimals`
                                      ),
                                      t: t,
                                      i18n: i18n,
                                      ns: ns,
                                  })}
                            <div className="table__cell__unit">USD</div>
                        </div>
                        {/* Token 24h variation (if enabled) */}
                        {!auth.contractStatusData.canOperate ? (
                            "--"
                        ) : (
                            <div className="table__cell__variation">
                                {`${getSign()} `}
                                <NumericLabel {...{ params }}>
                                    {variationFormat}
                                </NumericLabel>
                                {" %"}
                                <span
                                    className={`variation-indicator ${
                                        getSign() === "+"
                                            ? "positive-indicator"
                                            : getSign() === "-"
                                              ? "negative-indicator"
                                              : "neutral-indicator"
                                    }`}
                                ></span>
                            </div>
                        )}
                        {/* Token balance */}
                        <div className="table__cell__amount">
                            {PrecisionNumbers({
                                amount: auth.userBalanceData.CA[dataItem.key]
                                    .balance,
                                token: settings.tokens.CA[dataItem.key],
                                decimals: t(
                                    `portfolio.tokens.CA.rows.${dataItem.key}.balance_decimals`
                                ),
                                t: t,
                                i18n: i18n,
                                ns: ns,
                            })}
                            {t(
                                `portfolio.tokens.CA.rows.${dataItem.key}.symbol`
                            )}
                        </div>
                        {/* Token price */}
                        <div className="table__cell__usdBalance">
                            {!auth.contractStatusData.canOperate
                                ? "--"
                                : PrecisionNumbers({
                                      amount: balanceUSD,
                                      token: settings.tokens.CA[dataItem.key],
                                      decimals: 2,
                                      t: t,
                                      i18n: i18n,
                                      ns: ns,
                                      skipContractConvert: true,
                                  })}
                            <div className="table__cell__unit">USD</div>
                        </div>
                    </div>
                ),
            });
            count += 1;
        });

    // Token TC
    if (auth.contractStatusData && auth.userBalanceData) {
        balance = new BigNumber(
            fromContractPrecisionDecimals(
                auth.userBalanceData.TC.balance,
                settings.tokens.TC[0].decimals
            )
        );
        const priceTEC = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.getPTCac,
                settings.tokens.TC[0].decimals
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
                settings.tokens.TC[0].decimals
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
                return "";
            }
            if (priceDelta.isPositive()) {
                return "+";
            }
            return "-";
        };
        const variationFormat = variation
            .abs()
            .toFormat(2, BigNumber.ROUND_UP, {
                decimalSeparator: ".",
                groupSeparator: ",",
            });

        // Add TC token data to tokensData array
        tokensData.push({
            key: itemIndex,
            renderRow: (
                <div className="table__row">
                    {/* Token icon, name and ticker */}
                    <div className="table__cell__name">
                        <div className="icon-token-tc token__icon"></div>
                        <span className="token__name">
                            {t(`portfolio.tokens.CA.rows.${itemIndex}.title`, {
                                ns: ns,
                            })}
                        </span>
                        <span className="token__ticker">
                            {t(`portfolio.tokens.CA.rows.${itemIndex}.symbol`, {
                                ns: ns,
                            })}
                        </span>
                    </div>
                    {/* Token price */}
                    <div className="table__cell__price">
                        {!auth.contractStatusData.canOperate
                            ? "--"
                            : PrecisionNumbers({
                                  amount: price,
                                  token: settings.tokens.TC[0],
                                  decimals: t(
                                      `portfolio.tokens.CA.rows.${itemIndex}.price_decimals`
                                  ),
                                  t: t,
                                  i18n: i18n,
                                  ns: ns,
                                  skipContractConvert: true,
                              })}
                        <div className="table__cell__unit">USD</div>
                    </div>
                    {/* Token 24h variation (if enabled) */}
                    {!auth.contractStatusData.canOperate ? (
                        "--"
                    ) : (
                        <div className="table__cell__variation">
                            {`${getSign()} `}
                            <NumericLabel {...{ params }}>
                                {variationFormat}
                            </NumericLabel>
                            {" %"}
                            <span
                                className={`variation-indicator ${
                                    getSign() === "+"
                                        ? "positive-indicator"
                                        : getSign() === "-"
                                          ? "negative-indicator"
                                          : "neutral-indicator"
                                }`}
                            ></span>
                        </div>
                    )}
                    <div className="table__cell__amount">
                        {PrecisionNumbers({
                            amount: auth.userBalanceData.TC.balance,
                            token: settings.tokens.TC[0],
                            decimals: t(
                                `portfolio.tokens.CA.rows.${itemIndex}.balance_decimals`
                            ),
                            t: t,
                            i18n: i18n,
                            ns: ns,
                        })}
                        <div>
                            {t(`portfolio.tokens.CA.rows.${itemIndex}.symbol`)}
                        </div>
                    </div>
                    <div className="table__cell__usdBalance">
                        {!auth.contractStatusData.canOperate
                            ? "--"
                            : PrecisionNumbers({
                                  amount: balanceUSD,
                                  token: settings.tokens.TC[0],
                                  decimals: 2,
                                  t: t,
                                  i18n: i18n,
                                  ns: ns,
                                  skipContractConvert: true,
                              })}
                        <div className="table__cell__unit">USD</div>
                    </div>
                </div>
            ),
        });

        count += 1;
    }

    const TokensTP = settings.tokens.TP;
    // Iterate tokens TP
    auth.contractStatusData &&
        auth.userBalanceData &&
        TokensTP.forEach(function (dataItem) {
            // Skip token if not pegged to 1:1 USD
            if (!dataItem.peggedUSD) return;

            balance = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.userBalanceData.TP[dataItem.key].balance,
                    settings.tokens.TP[dataItem.key].decimals
                )
            );
            price = new BigNumber(1);
            balanceUSD = balance.times(price);

            // variation
            const priceHistory = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.historic.PP_TP[dataItem.key],
                    settings.tokens.TP[dataItem.key].decimals
                )
            );
            const priceDelta = price.minus(priceHistory);
            const variation = priceDelta.abs().div(priceHistory).times(100);

            const priceDeltaFormat = priceDelta.toFormat(
                2,
                BigNumber.ROUND_UP,
                {
                    decimalSeparator: ".",
                    groupSeparator: ",",
                }
            );
            const variationFormat = variation.toFormat(2, BigNumber.ROUND_UP, {
                decimalSeparator: ".",
                groupSeparator: ",",
            });

            const itemIndex = count;

            // Add TP token data to tokensData array

            tokensData.push({
                key: itemIndex,
                renderRow: (
                    <div className="table__row">
                        {/* Token icon, name and ticker */}
                        <div className="table__cell__name">
                            <div className="icon-token-tp_0 token__icon"></div>{" "}
                            <span className="token__name">
                                {t(
                                    `portfolio.tokens.CA.rows.${itemIndex}.title`,
                                    {
                                        ns: ns,
                                    }
                                )}
                            </span>
                            <span className="token__ticker">
                                {t(
                                    `portfolio.tokens.CA.rows.${itemIndex}.symbol`,
                                    {
                                        ns: ns,
                                    }
                                )}
                            </span>
                        </div>
                        <div className="table__cell__price">
                            {!auth.contractStatusData.canOperate
                                ? "--"
                                : PrecisionNumbers({
                                      amount: price,
                                      token: settings.tokens.TP[dataItem.key],
                                      decimals: t(
                                          `portfolio.tokens.CA.rows.${itemIndex}.price_decimals`
                                      ),
                                      t: t,
                                      i18n: i18n,
                                      ns: ns,
                                      skipContractConvert: true,
                                  })}
                            <div className="table__cell__unit">USD</div>
                        </div>
                        {!auth.contractStatusData.canOperate ? (
                            "--"
                        ) : (
                            <div className="table__cell__variation">
                                <NumericLabel {...{ params }}>{0}</NumericLabel>
                                {" %"}
                                <span
                                    className={
                                        "variation-indicator neutral-indicator"
                                    }
                                ></span>
                            </div>
                        )}
                        <div className="table__cell__amount">
                            {PrecisionNumbers({
                                amount: auth.userBalanceData.TP[dataItem.key]
                                    .balance,
                                token: settings.tokens.TP[dataItem.key],
                                decimals: 2,
                                t: t,
                                i18n: i18n,
                                ns: ns,
                            })}
                            {t(`portfolio.tokens.CA.rows.${itemIndex}.symbol`)}
                        </div>
                        <div className="table__cell__usdBalance">
                            {!auth.contractStatusData.canOperate
                                ? "--"
                                : PrecisionNumbers({
                                      amount: balanceUSD,
                                      token: settings.tokens.TP[dataItem.key],
                                      decimals: 2,
                                      t: t,
                                      i18n: i18n,
                                      ns: ns,
                                      skipContractConvert: true,
                                  })}
                            <div className="table__cell__unit">USD</div>
                        </div>
                    </div>
                ),
            });

            count += 1;
        });

    // TF
    if (auth.contractStatusData && auth.userBalanceData) {
        balance = new BigNumber(
            fromContractPrecisionDecimals(
                auth.userBalanceData.FeeToken.balance,
                settings.tokens.TF[0].decimals
            )
        );
        price = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.PP_FeeToken,
                settings.tokens.TF[0].decimals
            )
        );
        const priceCA = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.PP_CA[0],
                settings.tokens.CA[0].decimals
            )
        );
        balanceUSD = balance.times(price).times(priceCA);

        // variation
        const priceHistory = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.historic.PP_FeeToken,
                settings.tokens.TF[0].decimals
            )
        );
        const priceDelta = price.minus(priceHistory);
        const variation = priceDelta.abs().div(priceHistory).times(100);

        const itemIndex = count;

        const priceDeltaFormat = priceDelta.toFormat(
            t(`portfolio.tokens.CA.rows.${itemIndex}.price_decimals`),
            BigNumber.ROUND_UP,
            {
                decimalSeparator: ".",
                groupSeparator: ",",
            }
        );
        const getSign = () => {
            if (priceDelta.isZero()) {
                return "";
            }
            if (priceDelta.isPositive()) {
                return "+";
            }
            return "-";
        };
        const variationFormat = variation.toFormat(2, BigNumber.ROUND_UP, {
            decimalSeparator: ".",
            groupSeparator: ",",
        });

        // Add TF token data to tokensData array
        tokensData.push({
            key: itemIndex,
            renderRow: (
                <div className="table__row">
                    {/* Token icon, name and ticker */}
                    <div className="table__cell__name">
                        <div className="icon-token-tf token__icon"></div>
                        <span className="token__name">
                            {t(`portfolio.tokens.CA.rows.${itemIndex}.title`, {
                                ns: ns,
                            })}
                        </span>
                        <span className="token__ticker">
                            {t(`portfolio.tokens.CA.rows.${itemIndex}.symbol`, {
                                ns: ns,
                            })}
                        </span>
                    </div>
                    <div className="table__cell__price">
                        {!auth.contractStatusData.canOperate
                            ? "--"
                            : PrecisionNumbers({
                                  amount: price.times(priceCA),
                                  token: settings.tokens.TF[0],
                                  decimals: t(
                                      `portfolio.tokens.CA.rows.${itemIndex}.price_decimals`
                                  ),
                                  t: t,
                                  i18n: i18n,
                                  ns: ns,
                                  skipContractConvert: true,
                              })}
                        <div className="table__cell__unit">USD</div>
                    </div>
                    {!auth.contractStatusData.canOperate ? (
                        "--"
                    ) : (
                        <div className="table__cell__variation">
                            {`${getSign()} `}
                            <NumericLabel {...{ params }}>
                                {variationFormat}
                            </NumericLabel>
                            {" %"}
                            <span
                                className={`variation-indicator ${
                                    getSign() === "+"
                                        ? "positive-indicator"
                                        : getSign() === "-"
                                          ? "negative-indicator"
                                          : "neutral-indicator"
                                }`}
                            ></span>
                        </div>
                    )}
                    <div className="table__cell__amount">
                        {PrecisionNumbers({
                            amount: auth.userBalanceData.FeeToken.balance,
                            token: settings.tokens.TF[0],
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                        })}
                        {t(`portfolio.tokens.CA.rows.${itemIndex}.symbol`)}
                    </div>
                    <div className="table__cell__usdBalance">
                        {!auth.contractStatusData.canOperate
                            ? "--"
                            : PrecisionNumbers({
                                  amount: balanceUSD,
                                  token: settings.tokens.TF[0],
                                  decimals: 2,
                                  t: t,
                                  i18n: i18n,
                                  ns: ns,
                                  skipContractConvert: true,
                              })}
                        <div className="table__cell__unit">USD</div>
                    </div>
                </div>
            ),
        });
        count += 1;
    } else {
        count += 1;
    }

    // Coinbase
    if (
        auth.contractStatusData &&
        auth.userBalanceData &&
        settings.collateral !== "coinbase"
    ) {
        balance = new BigNumber(
            fromContractPrecisionDecimals(
                auth.userBalanceData.coinbase,
                settings.tokens.COINBASE[0].decimals
            )
        );
        price = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.PP_COINBASE,
                settings.tokens.COINBASE[0].decimals
            )
        );
        balanceUSD = balance.times(price);

        // variation
        const priceHistory = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.historic.PP_COINBASE,
                settings.tokens.COINBASE[0].decimals
            )
        );
        const priceDelta = price.minus(priceHistory);
        const variation = priceDelta.abs().div(priceHistory).times(100);

        const itemIndex = count;

        const priceDeltaFormat = priceDelta.toFormat(
            t(`portfolio.tokens.CA.rows.${itemIndex}.price_decimals`),
            BigNumber.ROUND_UP,
            {
                decimalSeparator: ".",
                groupSeparator: ",",
            }
        );
        const getSign = () => {
            if (priceDelta.isZero()) {
                return "";
            }
            if (priceDelta.isPositive()) {
                return "+";
            }
            return "-";
        };
        const variationFormat = variation.toFormat(2, BigNumber.ROUND_UP, {
            decimalSeparator: ".",
            groupSeparator: ",",
        });

        // Add Coinbase token data to tokensData array if conditions are met
        tokensData.push({
            key: itemIndex,
            rowData: (
                <div className="table__row">
                    {/* Token icon, name and ticker */}
                    <div className="table__cell__price">
                        <div className="icon-token-coinbase token__icon"></div>
                        <span className="token__name">
                            {t(`portfolio.tokens.CA.rows.${itemIndex}.title`, {
                                ns: ns,
                            })}
                        </span>
                        <span className="token__ticker">
                            {t(`portfolio.tokens.CA.rows.${itemIndex}.symbol`, {
                                ns: ns,
                            })}
                        </span>
                    </div>{" "}
                    <div>
                        {!auth.contractStatusData.canOperate
                            ? "--"
                            : PrecisionNumbers({
                                  amount: auth.contractStatusData.PP_COINBASE,
                                  token: settings.tokens.COINBASE[0],
                                  decimals: t(
                                      `portfolio.tokens.CA.rows.${itemIndex}.price_decimals`
                                  ),
                                  t: t,
                                  i18n: i18n,
                                  ns: ns,
                              })}
                    </div>
                    {!auth.contractStatusData.canOperate ? (
                        "--"
                    ) : (
                        <div className="table__cell__variation">
                            {`${getSign()} `}
                            <NumericLabel {...{ params }}>
                                {variationFormat}
                            </NumericLabel>
                            {" %"}
                            <span
                                className={`variation-indicator ${
                                    getSign() === "+"
                                        ? "positive-indicator"
                                        : getSign() === "-"
                                          ? "negative-indicator"
                                          : "neutral-indicator"
                                }`}
                            ></span>
                        </div>
                    )}
                    <div className="table__cell_amount">
                        {PrecisionNumbers({
                            amount: auth.userBalanceData.coinbase,
                            token: settings.tokens.COINBASE[0],
                            decimals: t(
                                `portfolio.tokens.CA.rows.${itemIndex}.balance_decimals`
                            ),
                            t: t,
                            i18n: i18n,
                            ns: ns,
                        })}
                    </div>
                    <div className="table__cell__price">
                        {!auth.contractStatusData.canOperate
                            ? "--"
                            : PrecisionNumbers({
                                  amount: balanceUSD,
                                  token: settings.tokens.COINBASE[0],
                                  decimals: 2,
                                  t: t,
                                  i18n: i18n,
                                  ns: ns,
                                  skipContractConvert: true,
                              })}
                        <div className="table__cell__unit">USD</div>
                    </div>
                </div>
            ),
        });
    }
    // Non USD pegged tokens START

    // Rows
    auth.contractStatusData &&
        auth.userBalanceData &&
        settings.tokens.TP.forEach(function (dataItem) {
            // If it's pegged to 1:1 USD not display in this table
            if (dataItem.peggedUSD) return;

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
            priceHistory = ConvertPeggedTokenPrice(
                auth,
                dataItem.key,
                priceHistory
            );

            const priceDelta = price.minus(priceHistory);
            const variation = priceDelta.abs().div(priceHistory).times(100);

            let signPriceDelta = "";
            if (priceDelta.gt(0)) signPriceDelta = "+";

            const priceDeltaFormat = priceDelta.toFormat(
                2,
                BigNumber.ROUND_UP,
                { decimalSeparator: ".", groupSeparator: "," }
            );
            const getSign = () => {
                if (priceDelta.isZero()) {
                    return "";
                }
                if (priceDelta.isPositive()) {
                    return "+";
                }
                return "-";
            };
            const variationFormat = variation.toFormat(2, BigNumber.ROUND_UP, {
                decimalSeparator: ".",
                groupSeparator: ",",
            });

            tokensData.push({
                key: dataItem.key,
                renderRow: (
                    <div className="table__row">
                        <div className="table__cell__name">
                            <div
                                className={`icon-token-tp_${dataItem.key} token__icon`}
                            ></div>
                            <div className="token__name">
                                {t(
                                    `portfolio.tokens.TP.rows.${dataItem.key}.title`,
                                    {
                                        ns: ns,
                                    }
                                )}
                            </div>
                            <div className="token__ticker">
                                {t(
                                    `portfolio.tokens.TP.rows.${dataItem.key}.symbol`,
                                    {
                                        ns: ns,
                                    }
                                )}
                            </div>
                        </div>
                        <div className="table__cell__price">
                            {!auth.contractStatusData.canOperate
                                ? "--"
                                : PrecisionNumbers({
                                      amount: price,
                                      token: settings.tokens.TP[dataItem.key],
                                      decimals: 2,
                                      t: t,
                                      i18n: i18n,
                                      ns: ns,
                                      skipContractConvert: true,
                                  })}
                            <div className="table__cell__unit">
                                Tokens per USD
                            </div>
                        </div>
                        {!auth.contractStatusData.canOperate ? (
                            "--"
                        ) : (
                            <div className="table__cell__variation">
                                {`${getSign()} ${variationFormat} %`}
                                <span
                                    className={`variation-indicator ${
                                        getSign() === "+"
                                            ? "positive-indicator"
                                            : getSign() === "-"
                                              ? "negative-indicator"
                                              : "neutral-indicator"
                                    }`}
                                ></span>
                            </div>
                        )}{" "}
                        <div className="table__cell__amount">
                            {PrecisionNumbers({
                                amount: balance,
                                token: settings.tokens.TP[dataItem.key],
                                decimals: 2,
                                t: t,
                                i18n: i18n,
                                ns: ns,
                                skipContractConvert: true,
                            })}
                            {t(
                                `portfolio.tokens.TP.rows.${dataItem.key}.symbol`
                            )}
                        </div>
                        <div className="table__cell__usdBalance">
                            {!auth.contractStatusData.canOperate
                                ? "--"
                                : PrecisionNumbers({
                                      amount: balanceUSD,
                                      token: settings.tokens.TP[dataItem.key],
                                      decimals: 3,
                                      t: t,
                                      i18n: i18n,
                                      ns: ns,
                                      skipContractConvert: true,
                                  })}
                            <div className="table__cell__unit">USD</div>
                        </div>
                    </div>
                ),
            });
        });

    //  Non USD pegged tokens END

    return ready ? (
        <div>
            <div className="table__header">
                <div className="table__cell__name">Token</div>
                <div className="table__cell__price">Price</div>
                <div className="table__cell__variation">Variation 24h</div>
                <div className="table__cell__amount">Balance</div>
                <div className="table__cell__usdBalance">USD</div>
            </div>
            <Table
                showHeader={false}
                columns={columnsData}
                dataSource={tokensData}
                pagination={false}
                scroll={undefined}
            />
        </div>
    ) : (
        <Skeleton active />
    );
}
