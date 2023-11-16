/* eslint-disable no-undef */

import BigNumber from 'bignumber.js';
import Web3 from 'web3';

BigNumber.config({
    ROUNDING_MODE: BigNumber.ROUND_DOWN,
    FORMAT: { decimalSeparator: '.', groupSeparator: ',' }
});

const getGasPrice = async (web3) => {
    try {
        const gasPrice = await web3.eth.getGasPrice();
        //gasPrice = web3.utils.fromWei(gasPrice);
        return gasPrice;
    } catch (e) {
        console.log(e);
    }
};

const toContractPrecision = (amount) => {
    return Web3.utils.toWei(
        BigNumber(amount).toFormat(18, BigNumber.ROUND_DOWN),
        'ether'
    );
};

const toContractPrecisionDecimals = (amount, decimals) => {
    const result = new BigNumber(
        amount.toFormat(decimals, BigNumber.ROUND_DOWN)
    )
        .times(precision(decimals))
        .toFixed(0);
    return result;
};

const precision = (contractDecimals) =>
    new BigNumber(10).exponentiatedBy(contractDecimals);

const fromContractPrecisionDecimals = (amount, decimals) => {
    return new BigNumber(amount).div(precision(decimals));
};

export {
    getGasPrice,
    toContractPrecision,
    toContractPrecisionDecimals,
    fromContractPrecisionDecimals
};
