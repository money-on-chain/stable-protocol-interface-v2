import BigNumber from 'bignumber.js';

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

// default format
BigNumber.config({
    FORMAT: formatLocalMap.en
});

const fromContractPrecisionDecimals = (amount, decimals) => {
    return new BigNumber(amount).div(new BigNumber(10).exponentiatedBy(decimals));
};

export { formatLocalMap, fromContractPrecisionDecimals };
