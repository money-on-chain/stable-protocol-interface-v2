import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import {toContractPrecisionDecimals, getGasPrice} from './utils';


const AllowanceUseWrapper = async (interfaceContext, token, allow, tokenDecimals, onTransaction, onReceipt) => {

    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;
    const MocCAWrapperAddress = dContracts.contracts.MocCAWrapper.options.address

    let amountAllowance = new BigNumber('0')
    if (allow) {
        amountAllowance = new BigNumber(1000) //Number.MAX_SAFE_INTEGER.toString()
    }

    // Calculate estimate gas cost
    const estimateGas = await token.methods
        .approve(MocCAWrapperAddress, toContractPrecisionDecimals(amountAllowance, tokenDecimals))
        .estimateGas({ from: account, value: '0x' })

    // Send tx
    const receipt = token.methods
        .approve(MocCAWrapperAddress, toContractPrecisionDecimals(amountAllowance, tokenDecimals))
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
    AllowanceUseWrapper
    };