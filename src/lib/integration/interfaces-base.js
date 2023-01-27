import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import {toContractPrecisionDecimals, getGasPrice} from './utils';


const AllowanceAmount = async (interfaceContext, token, contractAllow, amountAllowance, tokenDecimals, onTransaction, onReceipt) => {

    const { web3, account } = interfaceContext;
    const contractAllowAddress = contractAllow.options.address

    // Calculate estimate gas cost
    const estimateGas = await token.methods
        .approve(contractAllowAddress, toContractPrecisionDecimals(amountAllowance, tokenDecimals))
        .estimateGas({ from: account, value: '0x' })

    // Send tx
    const receipt = token.methods
        .approve(contractAllowAddress, toContractPrecisionDecimals(amountAllowance, tokenDecimals))
        .send({
                from: account,
                value: '0x',
                gasPrice: await getGasPrice(web3),
                gas: estimateGas * 2,
                gasLimit: estimateGas * 2
            }
        ).on('transactionHash', onTransaction).on('receipt', onReceipt);

    return receipt

}

export {
    AllowanceAmount
};