import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import settings from '../../settings/settings.json';
import {
    toContractPrecisionDecimals,
    getGasPrice,
    fromContractPrecisionDecimals
} from './utils';

const mintTC = async (
    interfaceContext,
    caIndex,
    qTC,
    limitAmount,
    onTransaction,
    onReceipt
) => {
    // Mint Collateral token with CA
    const { web3, contractStatusData, userBalanceData, account } =
        interfaceContext;
    const dContracts = window.dContracts;

    const MocCAWrapper = dContracts.contracts.MocCAWrapper;
    const caToken = dContracts.contracts.CA[caIndex];
    const caAddress = caToken.options.address;

    // Verifications

    // User have sufficient reserve to pay?
    console.log(
        `To mint ${qTC} ${
            settings.tokens.TC.name
        } you need > ${limitAmount.toString()} ${
            settings.tokens.CA[caIndex].name
        } in your balance`
    );
    const userReserveBalance = new BigNumber(
        fromContractPrecisionDecimals(
            userBalanceData.CA[caIndex].balance,
            settings.tokens.CA[caIndex].decimals
        )
    );
    if (limitAmount.gt(userReserveBalance))
        throw new Error(
            `Insufficient ${settings.tokens.CA[caIndex].name} balance`
        );

    // Allowance    reserveAllowance
    console.log(
        `Allowance: To mint ${qTC} ${
            settings.tokens.TC.name
        } you need > ${limitAmount.toString()} ${
            settings.tokens.CA[caIndex].name
        } in your spendable balance`
    );
    /*
    const userSpendableBalance = new BigNumber(
        fromContractPrecisionDecimals(
            userBalanceData.CA[caIndex].allowance,
            settings.tokens.CA[caIndex].decimals
        )
    );
    if (limitAmount.gt(userSpendableBalance))
        throw new Error(
            'Insufficient spendable balance... please make an allowance to the MoC contract'
        );
    */
    // Calculate estimate gas cost
    const estimateGas = await MocCAWrapper.methods
        .mintTC(
            caAddress,
            toContractPrecisionDecimals(
                new BigNumber(qTC),
                settings.tokens.TC.decimals
            ),
            toContractPrecisionDecimals(
                limitAmount,
                settings.tokens.CA[caIndex].decimals
            )
        )
        .estimateGas({ from: account, value: '0x' });

    // Send tx
    const receipt = MocCAWrapper.methods
        .mintTC(
            caAddress,
            toContractPrecisionDecimals(
                new BigNumber(qTC),
                settings.tokens.TC.decimals
            ),
            toContractPrecisionDecimals(
                limitAmount,
                settings.tokens.CA[caIndex].decimals
            )
        )
        .send({
            from: account,
            value: '0x',
            gasPrice: await getGasPrice(web3),
            gas: estimateGas * 2,
            gasLimit: estimateGas * 2
        })
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt;
};

const redeemTC = async (
    interfaceContext,
    caIndex,
    qTC,
    limitAmount,
    onTransaction,
    onReceipt
) => {
    // Redeem Collateral token receiving CA

    const { web3, contractStatusData, userBalanceData, account } =
        interfaceContext;
    const dContracts = window.dContracts;

    const MocCAWrapper = dContracts.contracts.MocCAWrapper;
    const caToken = dContracts.contracts.CA[caIndex];
    const caAddress = caToken.options.address;

    // Verifications

    // User have sufficient TC in balance?
    console.log(
        `Redeeming ${qTC} ${settings.tokens.TC.name} ... getting approx limit down to: ${limitAmount} ${settings.tokens.CA[caIndex].name}... `
    );
    const userTCBalance = new BigNumber(
        fromContractPrecisionDecimals(
            userBalanceData.TC.balance,
            settings.tokens.TC.decimals
        )
    );
    if (new BigNumber(qTC).gt(userTCBalance))
        throw new Error(`Insufficient ${settings.tokens.TC.name} user balance`);

    // There are sufficient TC in the contracts to redeem?
    const tcAvailableToRedeem = new BigNumber(
        Web3.utils.fromWei(contractStatusData.getTCAvailableToRedeem)
    );
    if (new BigNumber(qTC).gt(tcAvailableToRedeem))
        throw new Error(
            `Insufficient ${settings.tokens.TC.name}available to redeem in contract`
        );

    // There are sufficient CA in the contract
    const caBalance = new BigNumber(
        fromContractPrecisionDecimals(
            contractStatusData.getACBalance[caIndex],
            settings.tokens.CA[caIndex].decimals
        )
    );
    if (new BigNumber(limitAmount).gt(caBalance))
        throw new Error(
            `Insufficient ${settings.tokens.CA[caIndex].name} in the contract. Balance: ${caBalance} ${settings.tokens.CA[caIndex].name}`
        );

    // Redeem function... no values sent
    const valueToSend = null;

    // Calculate estimate gas cost
    const estimateGas = await MocCAWrapper.methods
        .redeemTC(
            caAddress,
            toContractPrecisionDecimals(
                new BigNumber(qTC),
                settings.tokens.TC.decimals
            ),
            toContractPrecisionDecimals(
                limitAmount,
                settings.tokens.CA[caIndex].decimals
            )
        )
        .estimateGas({ from: account, value: '0x' });

    // Send tx
    const receipt = MocCAWrapper.methods
        .redeemTC(
            caAddress,
            toContractPrecisionDecimals(
                new BigNumber(qTC),
                settings.tokens.TC.decimals
            ),
            toContractPrecisionDecimals(
                limitAmount,
                settings.tokens.CA[caIndex].decimals
            )
        )
        .send({
            from: account,
            value: '0x',
            gasPrice: await getGasPrice(web3),
            gas: estimateGas * 2,
            gasLimit: estimateGas * 2
        })
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt;
};

const mintTP = async (
    interfaceContext,
    caIndex,
    tpIndex,
    qTP,
    limitAmount,
    onTransaction,
    onReceipt
) => {
    // Mint pegged token with collateral CA BAG

    const { web3, contractStatusData, userBalanceData, account } =
        interfaceContext;
    const dContracts = window.dContracts;

    const MocCAWrapper = dContracts.contracts.MocCAWrapper;
    const caToken = dContracts.contracts.CA[caIndex];
    const caAddress = caToken.options.address;

    // Verifications

    // User have sufficient reserve to pay?
    console.log(
        `To mint ${qTP} ${
            settings.tokens.TP[tpIndex].name
        } you need > ${limitAmount.toString()} ${
            settings.tokens.CA[caIndex].name
        } in your balance`
    );
    const userReserveBalance = new BigNumber(
        fromContractPrecisionDecimals(
            userBalanceData.CA[caIndex].balance,
            settings.tokens.CA[caIndex].decimals
        )
    );
    if (limitAmount.gt(userReserveBalance))
        throw new Error(
            `Insufficient ${settings.tokens.CA[caIndex].name} balance`
        );

    // Allowance
    console.log(
        `Allowance: To mint ${qTP} ${
            settings.tokens.TP[tpIndex].name
        } you need > ${limitAmount.toString()} ${
            settings.tokens.CA[caIndex].name
        } in your spendable balance`
    );
    /*
    const userSpendableBalance = new BigNumber(
        fromContractPrecisionDecimals(
            userBalanceData.CA[caIndex].allowance,
            settings.tokens.CA[caIndex].decimals
        )
    );
    if (limitAmount.gt(userSpendableBalance))
        throw new Error(
            'Insufficient spendable balance... please make an allowance to the MoC contract'
        );

     */

    // There are sufficient PEGGED in the contracts to mint?
    const tpAvailableToMint = new BigNumber(
        fromContractPrecisionDecimals(
            contractStatusData.getTPAvailableToMint[tpIndex],
            settings.tokens.TP[tpIndex].decimals
        )
    );
    if (new BigNumber(limitAmount).gt(tpAvailableToMint))
        throw new Error(
            `Insufficient ${settings.tokens.TP.name} available to mint`
        );

    // Calculate estimate gas cost
    const estimateGas = await MocCAWrapper.methods
        .mintTP(
            caAddress,
            tpIndex,
            toContractPrecisionDecimals(
                new BigNumber(qTP),
                settings.tokens.TP[tpIndex].decimals
            ),
            toContractPrecisionDecimals(
                limitAmount,
                settings.tokens.CA[caIndex].decimals
            )
        )
        .estimateGas({ from: account, value: '0x' });

    // Send tx
    const receipt = MocCAWrapper.methods
        .mintTP(
            caAddress,
            tpIndex,
            toContractPrecisionDecimals(
                new BigNumber(qTP),
                settings.tokens.TP[tpIndex].decimals
            ),
            toContractPrecisionDecimals(
                limitAmount,
                settings.tokens.CA[caIndex].decimals
            )
        )
        .send({
            from: account,
            value: '0x',
            gasPrice: await getGasPrice(web3),
            gas: estimateGas * 2,
            gasLimit: estimateGas * 2
        })
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt;
};

const redeemTP = async (
    interfaceContext,
    caIndex,
    tpIndex,
    qTP,
    limitAmount,
    onTransaction,
    onReceipt
) => {
    // Redeem pegged token receiving CA

    const { web3, contractStatusData, userBalanceData, account } =
        interfaceContext;
    const dContracts = window.dContracts;

    const MocCAWrapper = dContracts.contracts.MocCAWrapper;
    const caToken = dContracts.contracts.CA[caIndex];
    const caAddress = caToken.options.address;

    // Verifications

    // User have sufficient PEGGED Token in balance?
    console.log(
        `Redeeming ${qTP} ${settings.tokens.TP[tpIndex].name} ... getting approx: ${limitAmount} ${settings.tokens.CA[caIndex].name}... `
    );
    const userTPBalance = new BigNumber(
        fromContractPrecisionDecimals(
            userBalanceData.TP[tpIndex],
            settings.tokens.TP[tpIndex].decimals
        )
    );
    if (new BigNumber(qTP).gt(userTPBalance))
        throw new Error(
            `Insufficient ${settings.tokens.TP[tpIndex].name}  user balance`
        );

    // // There are sufficient Free Pegged Token in the contracts to redeem?
    // const tpAvailableToRedeem = new BigNumber(
    //     Web3.utils.fromWei(contractStatusData.getTPAvailableToMint[tpIndex])
    // );
    // if (new BigNumber(qTP).gt(tpAvailableToRedeem))
    //     throw new Error(
    //         `Insufficient ${settings.tokens.TP[tpIndex].name}  available to redeem in contract`
    //     );

    // There are sufficient CA in the contract
    const caBalance = new BigNumber(
        fromContractPrecisionDecimals(
            contractStatusData.getACBalance[caIndex],
            settings.tokens.CA[caIndex].decimals
        )
    );
    if (new BigNumber(limitAmount).gt(caBalance))
        throw new Error(
            `Insufficient ${settings.tokens.CA[caIndex].name} in the contract. Balance: ${caBalance} ${settings.tokens.CA[caIndex].name}`
        );

    // Calculate estimate gas cost
    const estimateGas = await MocCAWrapper.methods
        .redeemTP(
            caAddress,
            tpIndex,
            toContractPrecisionDecimals(
                new BigNumber(qTP),
                settings.tokens.TP[tpIndex].decimals
            ),
            toContractPrecisionDecimals(
                limitAmount,
                settings.tokens.CA[caIndex].decimals
            )
        )
        .estimateGas({ from: account, value: '0x' });

    // Send tx
    const receipt = MocCAWrapper.methods
        .redeemTP(
            caAddress,
            tpIndex,
            toContractPrecisionDecimals(
                new BigNumber(qTP),
                settings.tokens.TP[tpIndex].decimals
            ),
            toContractPrecisionDecimals(
                limitAmount,
                settings.tokens.CA[caIndex].decimals
            )
        )
        .send({
            from: account,
            value: '0x',
            gasPrice: await getGasPrice(web3),
            gas: estimateGas * 2,
            gasLimit: estimateGas * 2
        })
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt;
};

export { mintTC, redeemTC, mintTP, redeemTP };
