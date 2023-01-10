import {getDecimals} from "./helper";
import BigNumber from "bignumber.js";

const formatLocalMap = {
    es: {
        decimalSeparator: ',',
        groupSeparator: '.'
    },
    en: {
        decimalSeparator: '.',
        groupSeparator: ','
    }
};

const defaultPrecision = {
    "contractDecimals": 18,
    "decimals": 6
}

// default format
BigNumber.config({
    FORMAT: formatLocalMap.en
});

const formatMap = {
    TX: defaultPrecision,
    TC: defaultPrecision,
    TP: defaultPrecision,
    USD: defaultPrecision,
    USDPrice: defaultPrecision,
    RESERVE: defaultPrecision,
    TG: defaultPrecision,
    MOCMetrics: defaultPrecision,
    REWARD: defaultPrecision,
    COV: defaultPrecision,
    LEV: defaultPrecision,
    percentage: defaultPrecision,
    visiblePercentage: defaultPrecision,
    TXInterest: defaultPrecision,
    FreeDocInterest: defaultPrecision,
    commissionRate: defaultPrecision,
    valueVariation: defaultPrecision
};

const precision = ({ contractDecimals }) =>
    new BigNumber(10).exponentiatedBy(contractDecimals);

const adjustPrecision = (amount, currencyCode, AppProject) => {
    // return false
    const fd = formatMap[currencyCode];
    return fd
        ? {
              value: new BigNumber(amount).div(precision(fd)),
              // decimals: fd.decimals
              decimals: getDecimals(currencyCode, AppProject)
          }
        : { value: new BigNumber(amount), decimals: 2 };
};

const fromContractPrecisionDecimals = (amount, decimals) => {
    return new BigNumber(amount).div(new BigNumber(10).exponentiatedBy(decimals))
}


export {
    adjustPrecision,
    precision,
    formatLocalMap,
    fromContractPrecisionDecimals
};
