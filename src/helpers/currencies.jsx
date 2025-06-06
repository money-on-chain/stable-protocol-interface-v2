import React from "react";
import BigNumber from "bignumber.js";

import LogoIconCA_0 from "../assets/tokens/ca_0.svg?react";
import LogoIconCA_1 from "../assets/tokens/ca_1.svg?react";
import LogoIconCOINBASE from "../assets/tokens/coinbase.svg?react";
import LogoIconTC from "../assets/tokens/tc.svg?react";
import LogoIconTP_0 from "../assets/tokens/tp_0.svg?react";
import LogoIconTP_1 from "../assets/tokens/tp_1.svg?react";
import LogoIconTG_0 from "../assets/tokens/tg_0.svg?react";
import settings from "../settings/settings.json";
import { fromContractPrecisionDecimals } from "./Formats";

const currencies = [
    {
        value: "COINBASE",
        image: <LogoIconCOINBASE className="token__icon" />,
    },
    { value: "CA_0", image: <LogoIconCA_0 className="token__icon" /> },
    { value: "CA_1", image: <LogoIconCA_1 className="token__icon" /> },
    { value: "TC", image: <LogoIconTC className="token__icon" /> },
    { value: "TP_0", image: <LogoIconTP_0 className="token__icon" /> },
    { value: "TP_1", image: <LogoIconTP_1 className="token__icon" /> },
    { value: "TF", image: <LogoIconTG_0 className="token__icon" /> },
    { value: "TG", image: <LogoIconTG_0 className="token__icon" /> },
].map((it) => ({
    ...it,
}));

const getCurrenciesDetail = () => currencies;

function TokenSettings(tokenName) {
    // Ex. tokenName = CA_0, CA_1, TP_0, TP_1, TC, COINBASE
    const aTokenName = tokenName.split("_");
    let token = settings.tokens.CA[0];
    switch (aTokenName[0]) {
        case "CA":
            token = settings.tokens.CA[parseInt(aTokenName[1])];
            break;
        case "TP":
            token = settings.tokens.TP[parseInt(aTokenName[1])];
            break;
        case "TC":
            token = settings.tokens.TC[0];
            break;
        case "COINBASE":
            token = settings.tokens.COINBASE[0];
            break;
        case "TF":
            token = settings.tokens.TF[0];
            break;
        case "TG":
            token = settings.tokens.TG[0];
            break;
        default:
            throw new Error("Invalid token name");
    }

    return token;
}

function TokenBalance(auth, tokenName) {
    // Ex. tokenName = CA_0, CA_1, TP_0, TP_1, TC, COINBASE
    let balance = 0;

    if (!auth.userBalanceData) return balance;

    const aTokenName = tokenName.split("_");
    switch (aTokenName[0]) {
        case "CA":
            balance = auth.userBalanceData.CA[parseInt(aTokenName[1])].balance;
            break;
        case "TP":
            balance = auth.userBalanceData.TP[parseInt(aTokenName[1])].balance;
            break;
        case "TC":
            balance = auth.userBalanceData.TC.balance;
            break;
        case "COINBASE":
            balance = auth.userBalanceData.coinbase;
            break;
        case "TF":
            balance = auth.userBalanceData.FeeToken.balance;
            break;
        case "TG":
            balance = auth.userBalanceData.TG.balance;
            break;
        default:
            throw new Error("Invalid token name");
    }

    return balance;
}

function ConvertPeggedTokenPrice(auth, tpIndex, price) {
    if (settings.tokens.TP[tpIndex].peggedUSD) {
        return price;
    } else {
        const priceCA = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.PP_CA[0],
                settings.tokens.CA[0].decimals
            )
        );
        return price.div(priceCA);
    }
}

function hasNonUSDPeggedTokens() {
    let has = false;
    for (let i = 0; i < settings.tokens.TP.length; i++) {
        if (!settings.tokens.TP[i]["peggedUSD"]) has = true;
    }

    return has;
}

function TokenPrice(auth, tokenName) {
    // Ex. tokenName = CA_0, CA_1, TP_0, TP_1, TC, COINBASE
    let price = 0;

    if (!auth.contractStatusData) return 0;

    const aTokenName = tokenName.split("_");
    switch (aTokenName[0]) {
        case "CA":
            price = auth.contractStatusData.PP_CA[parseInt(aTokenName[1])];
            break;
        case "TP":
            price = auth.contractStatusData.PP_TP[parseInt(aTokenName[1])];
            break;
        case "TC":
            price = auth.contractStatusData.getPTCac;
            break;
        case "COINBASE":
            price = auth.contractStatusData.PP_COINBASE;
            break;
        case "TG":
            price = auth.contractStatusData.PP_FeeToken;
            break;

        default:
            throw new Error("Invalid token name");
    }

    return price;
}

function ConvertBalance(auth, tokenExchange, tokenReceive) {
    const rawAmount = TokenBalance(auth, tokenExchange);
    return ConvertAmount(auth, tokenExchange, tokenReceive, rawAmount);
}

function ConvertAmount(
    auth,
    tokenExchange,
    tokenReceive,
    rawAmount,
    amountInWei = true
) {
    const tokenExchangeSettings = TokenSettings(tokenExchange);
    const tokenReceiveSettings = TokenSettings(tokenReceive);
    let price = new BigNumber(0);

    let amount;
    if (amountInWei) {
        amount = new BigNumber(
            fromContractPrecisionDecimals(
                rawAmount,
                tokenReceiveSettings.decimals
            )
        );
    } else {
        amount = new BigNumber(rawAmount);
    }

    let cAmount = new BigNumber(0);

    // [tokenExchange,tokenReceive]
    //const tokenMap = `${tokenExchange},${tokenReceive}`;
    const aTokenExchange = tokenExchange.split("_");
    const aTokenReceive = tokenReceive.split("_");
    const aTokenMap = `${aTokenExchange[0]},${aTokenReceive[0]}`;

    switch (aTokenMap) {
        case "CA,TC":
            price = new BigNumber(
                fromContractPrecisionDecimals(
                    TokenPrice(auth, tokenReceive),
                    tokenReceiveSettings.decimals
                )
            );
            cAmount = amount.div(price);
            break;
        case "TP,CA":
            // Redeem Operation
            price = new BigNumber(
                fromContractPrecisionDecimals(
                    TokenPrice(auth, tokenExchange),
                    tokenExchangeSettings.decimals
                )
            );
            cAmount = amount.div(price);
            break;
        case "CA,TP":
            // Mint Operation
            price = new BigNumber(
                fromContractPrecisionDecimals(
                    TokenPrice(auth, tokenReceive),
                    tokenReceiveSettings.decimals
                )
            );
            cAmount = amount.times(price);
            break;
        case "TC,CA":
            // Redeem Operation
            price = new BigNumber(
                fromContractPrecisionDecimals(
                    TokenPrice(auth, tokenExchange),
                    tokenExchangeSettings.decimals
                )
            );
            cAmount = amount.times(price);
            break;
        case "TG,CA":
            // TG
            price = new BigNumber(
                fromContractPrecisionDecimals(
                    TokenPrice(auth, tokenExchange),
                    tokenExchangeSettings.decimals
                )
            );
            cAmount = amount.times(price);
            break;
        case "COINBASE,CA":
            // COINBASE
            price = new BigNumber(
                fromContractPrecisionDecimals(
                    TokenPrice(auth, tokenExchange),
                    tokenExchangeSettings.decimals
                )
            );
            cAmount = amount.times(price);
            break;
        case "CA,CA":
            cAmount = amount;
            break;
        default:
            throw new Error("Invalid token name");
    }

    return cAmount;
}

//const precision = (contractDecimals) =>
//    new BigNumber(10).exponentiatedBy(contractDecimals);

const AmountToVisibleValue = (
    rawAmount,
    tokenName,
    decimals,
    amountInWei = true
) => {
    const tokenSettings = TokenSettings(tokenName);

    let amount;
    if (amountInWei) {
        amount = new BigNumber(
            fromContractPrecisionDecimals(rawAmount, tokenSettings.decimals)
        );
    } else {
        amount = new BigNumber(rawAmount);
    }
    return amount.toFormat(decimals, BigNumber.ROUND_DOWN, {
        decimalSeparator: ".",
        groupSeparator: ",",
    });
};

function CalcCommission(
    auth,
    tokenExchange,
    tokenReceive,
    rawAmount,
    amountInWei = true
) {
    // Calc commissions

    const tokenExchangeSettings = TokenSettings(tokenExchange);
    const tokenReceiveSettings = TokenSettings(tokenReceive);

    let amount;
    if (amountInWei) {
        amount = new BigNumber(
            fromContractPrecisionDecimals(
                rawAmount,
                tokenExchangeSettings.decimals
            )
        );
    } else {
        amount = new BigNumber(rawAmount);
    }

    let feeParam;

    //const tokenMap = `${tokenExchange},${tokenReceive}`;
    const aTokenExchange = tokenExchange.split("_");
    const aTokenReceive = tokenReceive.split("_");
    const aTokenMap = `${aTokenExchange[0]},${aTokenReceive[0]}`;

    switch (aTokenMap) {
        case "CA,TC":
            // Mint TC
            feeParam = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.tcMintFee,
                    tokenReceiveSettings.decimals
                )
            );
            break;
        case "TP,CA":
            // Redeem TP
            feeParam = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.tpRedeemFees[
                        parseInt(aTokenExchange[1])
                    ],
                    tokenReceiveSettings.decimals
                )
            );
            break;
        case "CA,TP":
            // Mint TP
            feeParam = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.tpMintFees[
                        parseInt(aTokenReceive[1])
                    ],
                    tokenReceiveSettings.decimals
                )
            );
            break;
        case "TC,CA":
            // Redeem TC
            feeParam = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.tcRedeemFee,
                    tokenReceiveSettings.decimals
                )
            );
            break;
        default:
            throw new Error("Invalid token name");
    }

    // Fee Paying with Token
    const feeTokenPrice = new BigNumber(
        fromContractPrecisionDecimals(
            auth.contractStatusData.PP_FeeToken,
            tokenReceiveSettings.decimals
        )
    );
    const feeTokenPct = new BigNumber(
        fromContractPrecisionDecimals(
            auth.contractStatusData.feeTokenPct,
            tokenReceiveSettings.decimals
        )
    );
    const priceCA = new BigNumber(
        fromContractPrecisionDecimals(
            auth.contractStatusData.PP_CA[0],
            settings.tokens.CA[0].decimals
        )
    );
    const qFeeToken = amount.times(feeParam.times(feeTokenPct));

    // Markup Vendors
    const vendorMarkup = new BigNumber(
        fromContractPrecisionDecimals(
            auth.contractStatusData.vendorMarkup,
            tokenReceiveSettings.decimals
        )
    );
    const markOperation = amount.times(vendorMarkup);

    // Total fee token
    const totalFeeToken = qFeeToken.plus(markOperation);

    const feeInfo = {
        fee: amount.times(feeParam).plus(markOperation),
        feeUSD: amount.times(feeParam).plus(markOperation).times(priceCA),
        percent: feeParam.plus(vendorMarkup).times(100),
        markup: vendorMarkup,
        markOperation: markOperation,
        feeTokenPrice: feeTokenPrice,
        feeTokenPct: feeTokenPct,
        totalFeeToken: totalFeeToken.div(feeTokenPrice),
        totalFeeTokenUSD: totalFeeToken.times(priceCA),
        feeTokenPercent: feeParam
            .times(feeTokenPct)
            .plus(vendorMarkup)
            .times(100),
    };

    return feeInfo;
}

export {
    getCurrenciesDetail,
    TokenSettings,
    TokenBalance,
    TokenPrice,
    ConvertBalance,
    ConvertAmount,
    AmountToVisibleValue,
    CalcCommission,
    ConvertPeggedTokenPrice,
    hasNonUSDPeggedTokens,
};
