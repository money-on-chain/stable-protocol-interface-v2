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
import { generateTokenRow } from "./renderHelpers";

import "./Styles.scss";

export default function PortfolioTable(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);

    // Default values for all tokens
    let label = {
        price: t("portfolio.tokensTable.name"),
        price: t("portfolio.tokensTable.priceInUSD"),
        variation: t("portfolio.tokensTable.variation"),
        balance: t("portfolio.tokensTable.balance"),
        usdBalance: t("portfolio.tokensTable.usdBalance"),
    };

    useEffect(() => {
        // Set component ready when contract status data is available
        if (auth.contractStatusData) {
            setReady(true);
        }
    }, [auth]);

    const createAllTheTokens = (settings) => {
        let uniqueKeyCounter = 0;
        let allTheTokens = [];
        let tfTokenNames = new Set(); // Track TF token names

        // Step 1: Collect all tokens
        Object.entries(settings.tokens).forEach(([type, tokens]) => {
            tokens.forEach((token, index) => {
                allTheTokens.push({
                    uniqueKey: uniqueKeyCounter++,
                    key: token.key !== undefined ? token.key : index, // Fallback if key is missing
                    type,
                    name: token.name,
                    fullName: token.fullName || token.name, // Use name if fullName is missing
                    decimals: token.decimals,
                    visibleDecimals: token.visibleDecimals,
                    peggedUSD:
                        token.peggedUSD !== undefined ? token.peggedUSD : false, // Default to false
                });
                // Store TF token names for filtering TG later in Step 2
                if (type === "TF") {
                    tfTokenNames.add(token.name);
                }
            });
        });
        // Step 2: Remove TG tokens if a TF token with the same name exists
        allTheTokens = allTheTokens.filter(
            (token) => !(token.type === "TG" && tfTokenNames.has(token.name))
        );
        return allTheTokens;
    };
    const allTheTokens = createAllTheTokens(settings);
    console.log("allTheTokens -> ", allTheTokens);

    // Initialize arrays for token and column data
    const [usdPriceTokensData, setUsdPriceTokensData] = useState([]);
    const [nonUSDpriceTokensData, setNonUSDPriceTokensData] = useState([]);
    const addUsdPriceToken = (tokenData) => {
        setUsdPriceTokensData((prevData) => [...prevData, tokenData]);
    };

    const addNonUSDPriceToken = (tokenData) => {
        setNonUSDPriceTokensData((prevData) => [...prevData, tokenData]);
    };
    let rowNumber = 0;

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

    const processTokens = (allTheTokens, settings, t) => {
        if (!auth?.contractStatusData) {
            console.warn(
                "⚠️ auth.contractStatusData is missing, skipping processTokens."
            );
            return;
        }
        let newNonUSDpeggedTokenRows = []; // ✅ Store all updated rows
        let newUSDpeggedTokenRows = []; // ✅ Store all updated rows

        let count = 0;

        allTheTokens.forEach((token) => {
            let balance = new BigNumber(0);
            let price = new BigNumber(0);
            let priceTEC = new BigNumber(0);
            let priceCA = new BigNumber(0);
            let balanceUSD = new BigNumber(0);
            let priceDelta = new BigNumber(0);
            let variation = new BigNumber(0);
            let priceHistory = new BigNumber(0);
            let tokenIcon = "";

            switch (token.type) {
                case "COINBASE":
                    // CALCULATE COINBASE DATA

                    if (
                        auth.contractStatusData &&
                        auth.userBalanceData &&
                        settings.collateral !== "coinbase"
                    ) {
                        tokenIcon = "icon-token-" + token.type.toLowerCase();

                        balance = new BigNumber(
                            fromContractPrecisionDecimals(
                                auth.userBalanceData.coinbase,
                                token.decimals
                            )
                        );

                        price = new BigNumber(
                            fromContractPrecisionDecimals(
                                auth.contractStatusData.PP_COINBASE,
                                token.decimals
                            )
                        );
                        balanceUSD = balance.times(price);

                        // variation
                        priceHistory = new BigNumber(
                            fromContractPrecisionDecimals(
                                auth.contractStatusData.historic.PP_COINBASE,
                                token.decimals
                            )
                        );
                        priceDelta = price.minus(priceHistory);
                        variation = priceDelta
                            .abs()
                            .div(priceHistory)
                            .times(100);
                    }

                    break;
                case "CA":
                    // CALCULATE TOKENS CA DATA

                    tokenIcon =
                        "icon-token-" +
                        token.type.toLowerCase() +
                        "_" +
                        token.key;

                    // Convert balance to BigNumber with correct decimal precision
                    balance = new BigNumber(
                        fromContractPrecisionDecimals(
                            auth.userBalanceData.CA[token.key].balance,
                            token.decimals
                        )
                    );
                    price = new BigNumber(
                        fromContractPrecisionDecimals(
                            auth.contractStatusData.PP_CA[token.key],
                            token.decimals
                        )
                    );

                    balanceUSD = balance.times(price);

                    // variation
                    priceHistory = new BigNumber(
                        fromContractPrecisionDecimals(
                            auth.contractStatusData.historic.PP_CA[token.key],
                            token.decimals
                        )
                    );
                    priceDelta = price.minus(priceHistory);
                    variation = priceDelta.abs().div(priceHistory).times(100);

                    break;
                case "TP":
                    tokenIcon =
                        "icon-token-" +
                        token.type.toLowerCase() +
                        "_" +
                        token.key;

                    if (token.peggedUSD) {
                        // CALCULATE TOKENS TP USD-Pegged Tokens DATA

                        balance = new BigNumber(
                            fromContractPrecisionDecimals(
                                auth.userBalanceData.TP[token.key].balance,
                                token.decimals
                            )
                        );
                        // price = new BigNumber(1);
                        balanceUSD = balance.times(price);

                        // variation
                        priceHistory = new BigNumber(
                            fromContractPrecisionDecimals(
                                auth.contractStatusData.historic.PP_CA[
                                    token.key
                                ],
                                token.decimals
                            )
                        );
                        priceDelta = price.minus(priceHistory);
                        // priceDelta = new BigNumber(0);
                        const variation = priceDelta
                            .abs()
                            .div(priceHistory)
                            .times(100);
                        console.log("TOKEN KEY ", token.key);

                        console.log("PRICE ", price);
                        console.log("PRICE HISTORY", priceHistory);
                        console.log("PRICE DELTA", priceDelta);
                    } else {
                        // CALCULATE TOKENS TP NON-USD-Pegged Tokens DATA

                        const balance = new BigNumber(
                            fromContractPrecisionDecimals(
                                auth.userBalanceData.TP[token.key].balance,
                                token.decimals
                            )
                        );

                        let price = new BigNumber(
                            fromContractPrecisionDecimals(
                                auth.contractStatusData.PP_TP[token.key],
                                token.decimals
                            )
                        );
                        price = ConvertPeggedTokenPrice(auth, token.key, price);
                        const balanceUSD = balance.div(price);

                        // variation
                        let priceHistory = new BigNumber(
                            fromContractPrecisionDecimals(
                                auth.contractStatusData.historic.PP_TP[
                                    token.key
                                ],
                                token.decimals
                            )
                        );
                        priceHistory = ConvertPeggedTokenPrice(
                            auth,
                            token.key,
                            priceHistory
                        );

                        const priceDelta = price.minus(priceHistory);
                        const variation = priceDelta
                            .abs()
                            .div(priceHistory)
                            .times(100);

                        let signPriceDelta = "";
                        if (priceDelta.gt(0)) signPriceDelta = "+";
                    }
                    break;
                case "TC":
                    // CALCULATE TOKENS TC DATA

                    tokenIcon = "icon-token-" + token.type.toLowerCase();

                    balance = new BigNumber(
                        fromContractPrecisionDecimals(
                            auth.userBalanceData.TC.balance,
                            token.decimals
                        )
                    );

                    priceTEC = new BigNumber(
                        fromContractPrecisionDecimals(
                            auth.contractStatusData.getPTCac,
                            token.decimals
                        )
                    );
                    priceCA = new BigNumber(
                        fromContractPrecisionDecimals(
                            auth.contractStatusData.PP_CA[0],
                            token.decimals
                        )
                    );
                    price = priceTEC.times(priceCA);
                    balanceUSD = balance.times(price);

                    // variation
                    priceHistory = new BigNumber(
                        fromContractPrecisionDecimals(
                            auth.contractStatusData.historic.getPTCac,
                            token.decimals
                        )
                    ).times(priceCA);

                    priceDelta = price.minus(priceHistory);
                    variation = price
                        .minus(priceHistory)
                        .div(priceHistory)
                        .times(100);
                    break;
                case "TF":
                    // CALCULATE TOKENS TF DATA

                    tokenIcon = "icon-token-" + token.type.toLowerCase();
                    balance = new BigNumber(
                        fromContractPrecisionDecimals(
                            auth.userBalanceData.FeeToken.balance,
                            token.decimals
                        )
                    );
                    price = new BigNumber(
                        fromContractPrecisionDecimals(
                            auth.contractStatusData.PP_FeeToken,
                            token.decimals
                        )
                    );
                    priceCA = new BigNumber(
                        fromContractPrecisionDecimals(
                            auth.contractStatusData.PP_CA[0],
                            token.decimals
                        )
                    );
                    balanceUSD = balance.times(price).times(priceCA);

                    // variation
                    priceHistory = new BigNumber(
                        fromContractPrecisionDecimals(
                            auth.contractStatusData.historic.PP_FeeToken,
                            token.decimals
                        )
                    );
                    priceDelta = price.minus(priceHistory);
                    variation = priceDelta.abs().div(priceHistory).times(100);

                    break;
                case "TG":
                    console.log(`Processing ${token.name} (TG)`);
                    // CALCULATE TOKENS TG DATA

                    // CHECK if THERE IS A TF WITH SAME NAME. IF TRUE, SKIP.

                    break;
                default:
                    console.log(`Unknown token type for ${token.name}`);
                    break;
            }
            const label = token.fullName || token.name;
            const tokenName = token.fullName || token.name;
            const tokenTicker = token.name;
            const decimals = token.decimals;

            count++;

            // remove condition after DEBUGING

            const tokenRow = generateTokenRow({
                key: token.uniqueKey,
                label,
                tokenIcon,
                tokenName,
                tokenTicker,
                balance: balance.toFormat(
                    token.visibleDecimals,
                    BigNumber.ROUND_UP
                ), // ✅ Convert to string
                price: price.toFormat(
                    token.visibleDecimals,
                    BigNumber.ROUND_UP
                ), // ✅ Convert to string
                balanceUSD: balanceUSD.toFormat(
                    token.visibleDecimals,
                    BigNumber.ROUND_UP
                ), // ✅ Convert to string
                priceDelta,
                variation,
                decimals: token.visibleDecimals,
                auth,
                t,
                i18n,
                ns,
                params,
            });

            if (settings.collateral !== token.type.toLowerCase()) {
                // Skip coinbase token when collateral is coinbase
                if (token.type === "TP" && token.peggedUSD === false) {
                    newNonUSDpeggedTokenRows.push(tokenRow); // ✅ Store updated token Rows for nonUSDpegged
                } else {
                    newUSDpeggedTokenRows.push(tokenRow); // ✅ Store updated token Rows for USDpegged
                }
            }
        });
        setUsdPriceTokensData(newUSDpeggedTokenRows); // ✅ Overwrite the state instead of appending
        setNonUSDPriceTokensData(newNonUSDpeggedTokenRows); // ✅ Overwrite the state instead of appending
    };
    useEffect(() => {
        if (ready && auth?.contractStatusData) {
            processTokens(allTheTokens, settings, t);
        }
    }, [ready, auth]); // Runs only when `ready` or `auth` changes

    return ready ? (
        <div className="portfolio-table">
            {/* Display header and body for regular tokens */}
            <div className="table__header">
                <div className="table__cell__name">
                    {t("portfolio.tokens.CA.columns.name")}
                </div>
                <div className="table__cell__price">
                    {t("portfolio.tokens.CA.columns.price")}
                </div>
                <div className="table__cell__variation">
                    {!settings.showPriceVariation
                        ? null
                        : t("portfolio.tokens.CA.columns.variation")}
                </div>
                <div className="table__cell__amount">
                    {t("portfolio.tokens.CA.columns.balance")}
                </div>
                <div className="table__cell__usdBalance">
                    {t("portfolio.tokens.CA.columns.usd")}
                </div>
            </div>
            <div className="table__body">
                {usdPriceTokensData.map((item) => (
                    <div key={item.key} className="token-row">
                        {item.renderRow}
                    </div>
                ))}
            </div>
            {/* If non USD pegged CA tokens are available, display them header & body for them */}
            {nonUSDpriceTokensData.length > 0 && (
                <>
                    <div className="table__header">
                        <div className="table__cell__name">
                            {t("portfolio.tokens.TP.columns.name")}
                        </div>
                        <div className="table__cell__price">
                            {t("portfolio.tokens.TP.columns.price")}
                        </div>
                        <div className="table__cell__variation">
                            {!settings.showPriceVariation
                                ? null
                                : t("portfolio.tokens.TP.columns.variation")}
                        </div>
                        <div className="table__cell__amount">
                            {t("portfolio.tokens.TP.columns.balance")}
                        </div>
                        <div className="table__cell__usdBalance">
                            {t("portfolio.tokens.TP.columns.usd")}
                        </div>
                    </div>
                    <div className="table__body">
                        {nonUSDpriceTokensData.map((item) => (
                            <div key={item.key} className="token-row">
                                {item.renderRow}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    ) : (
        <Skeleton active />
    );
}
