import BigNumber from "bignumber.js";

import { toContractPrecisionDecimals, getGasPrice } from "./utils";

const AllowanceAmount = async (
    interfaceContext,
    token,
    contractAllow,
    amountAllowance,
    tokenDecimals,
    onTransaction,
    onReceipt
) => {
    const { web3, account } = interfaceContext;
    const contractAllowAddress = contractAllow.options.address;

    // Calculate estimate gas cost
    const estimateGas = await token.methods
        .approve(
            contractAllowAddress,
            toContractPrecisionDecimals(amountAllowance, tokenDecimals)
        )
        .estimateGas({ from: account, value: 0 });

    // Send tx
    const receipt = token.methods
        .approve(
            contractAllowAddress,
            toContractPrecisionDecimals(amountAllowance, tokenDecimals)
        )
        .send({
            from: account,
            value: 0,
            gasPrice: await getGasPrice(web3),
            gas: estimateGas,
            gasLimit: estimateGas,
        })
        .on("transactionHash", onTransaction)
        .on("receipt", onReceipt);

    return receipt;
};

const transferTokenTo = async (
    interfaceContext,
    token,
    tokenDecimals,
    to,
    amount,
    onTransaction,
    onReceipt
) => {
    const { web3, account } = interfaceContext;

    amount = new BigNumber(amount);

    // Calculate estimate gas cost
    const estimateGas = await token.methods
        .transfer(to, toContractPrecisionDecimals(amount, tokenDecimals))
        .estimateGas({ from: account, value: 0 });

    // Send tx
    const receipt = token.methods
        .transfer(to, toContractPrecisionDecimals(amount, tokenDecimals))
        .send({
            from: account,
            value: 0,
            gasPrice: await getGasPrice(web3),
            gas: estimateGas,
            gasLimit: estimateGas,
        })
        .on("transactionHash", onTransaction)
        .on("receipt", onReceipt);

    return receipt;
};

const transferCoinbaseTo = async (
    interfaceContext,
    to,
    amount,
    onTransaction,
    onReceipt
) => {
    const { web3, account } = interfaceContext;

    amount = new BigNumber(amount);

    const receipt = web3.eth
        .sendTransaction({
            from: account.toLowerCase(),
            to: to.toLowerCase(),
            gasPrice: await getGasPrice(web3),
            gasLimit: 21000,
            value: toContractPrecisionDecimals(amount, 18),
        })
        .on("transactionHash", onTransaction)
        .on("receipt", onReceipt);

    return receipt;
};

const AllowUseTokenMigrator = async (
    interfaceContext,
    newAllowance,
    onTransaction,
    onReceipt,
    onError
) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;

    if (!dContracts.contracts.tp_legacy)
        console.log(
            "Error: Please set token migrator address in environment vars!"
        );

    const tp_legacy = dContracts.contracts.tp_legacy;
    const tokenMigrator = dContracts.contracts.token_migrator;

    // Calculate estimate gas cost
    const estimateGas = await tp_legacy.methods
        .approve(
            tokenMigrator._address,
            toContractPrecisionDecimals(newAllowance, 18)
        )
        .estimateGas({ from: account, value: "0x" });

    // Send tx
    const receipt = tp_legacy.methods
        .approve(
            tokenMigrator._address,
            toContractPrecisionDecimals(newAllowance, 18)
        )
        .send({
            from: account,
            gasPrice: await getGasPrice(web3),
            gas: estimateGas,
            gasLimit: estimateGas,
        })
        .on("error", onError)
        .on("transactionHash", onTransaction)
        .on("receipt", onReceipt);

    return receipt;
};

const MigrateToken = async (
    interfaceContext,
    onTransaction,
    onReceipt,
    onError
) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;

    if (!dContracts.contracts.token_migrator)
        console.log(
            "Error: Please set token migrator address in environment vars!"
        );

    const tokenMigrator = dContracts.contracts.token_migrator;

    // Calculate estimate gas cost
    const estimateGas = await tokenMigrator.methods
        .migrateToken()
        .estimateGas({ from: account, value: "0x" });

    // Send tx
    const receipt = tokenMigrator.methods
        .migrateToken()
        .send({
            from: account,
            gasPrice: await getGasPrice(web3),
            gas: estimateGas,
            gasLimit: estimateGas,
        })
        .on("error", onError)
        .on("transactionHash", onTransaction)
        .on("receipt", onReceipt);

    return receipt;
};

export {
    AllowanceAmount,
    transferTokenTo,
    AllowUseTokenMigrator,
    MigrateToken,
    transferCoinbaseTo,
};
