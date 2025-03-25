import React, { Fragment } from "react";
import { Tooltip } from "antd";
import NumericLabel from "react-pretty-numbers";
import BigNumber from "bignumber.js";
import PropTypes from "prop-types";

const fromContractPrecisionDecimals = (amount, decimals) => {
    return new BigNumber(amount).div(
        new BigNumber(10).exponentiatedBy(decimals)
    );
};

const formatLargeNumber = (numberBig, decimals) => {
    const billion = new BigNumber(1e9);
    const million = new BigNumber(1e6);

    if (numberBig.gte(billion)) {
        const billions = numberBig.div(billion);
        return (
            billions.toFormat(decimals, BigNumber.ROUND_HALF_EVEN, {
                decimalSeparator: ".",
                groupSeparator: ",",
            }) + " B "
        );
    } else if (numberBig.gte(million)) {
        const millions = numberBig.div(million);
        return (
            millions.toFormat(decimals, BigNumber.ROUND_HALF_EVEN, {
                decimalSeparator: ".",
                groupSeparator: ",",
            }) + " M "
        );
    } else {
        return numberBig.toFormat(decimals, BigNumber.ROUND_UP, {
            decimalSeparator: ".",
            groupSeparator: ",",
        });
    }
};

const PrecisionNumbers = ({
    amount,
    token,
    decimals,
    numericLabelParams,
    i18n,
    skipContractConvert,
    isUSD = false,
}) => {
    let amountBig;
    if (skipContractConvert) {
        amountBig = amount;
    } else {
        amountBig = fromContractPrecisionDecimals(amount, token.decimals);
    }

    if (!decimals) {
        decimals = token.visibleDecimals;
    }
    let amountFormat;
    if (!isUSD) {
        amountFormat = amountBig.toFormat(decimals, BigNumber.ROUND_UP, {
            decimalSeparator: ".",
            groupSeparator: ",",
        });
    } else {
        amountFormat = formatLargeNumber(amountBig, decimals);
    }

    const params = Object.assign(
        {
            shortFormat: !isUSD,
            justification: "L",
            locales: i18n.languages[0],
            shortFormatMinValue: 1000000,
            commafy: true,
            shortFormatPrecision: decimals,
            precision: decimals,
            title: "",
            cssClass: ["display-inline"],
        },
        numericLabelParams
    );

    // If is very big number
    if (amountBig.gte(new BigNumber(115792089237316200000000000000000000))) {
        return <span>Infinity +</span>;
    } else {
        return isUSD ? (
            <Fragment>{amountFormat}</Fragment>
        ) : (
            <Tooltip title={amountBig.eq(0) ? "0" : amountBig}>
                <NumericLabel {...{ params }}>{amountFormat}</NumericLabel>
            </Tooltip>
        );
    }
};

export { PrecisionNumbers };

PrecisionNumbers.propTypes = {
    amount: PropTypes.object,
    token: PropTypes.object,
    decimals: PropTypes.number,
    numericLabelParams: PropTypes.object,
    i18n: PropTypes.object,
    skipContractConvert: PropTypes.bool,
    isUSD: PropTypes.bool,
};
