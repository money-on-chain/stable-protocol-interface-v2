import BigNumber from "bignumber.js";
import Web3 from "web3";

import { getGasPrice, toContractPrecisionDecimals } from "../utils";
import settings from "../../../settings/settings.json";

const addStake = async (
    interfaceContext,
    amount,
    address,
    onTransaction,
    onReceipt
) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;
    const tokenDecimals = settings.tokens.TG[0].decimals;

    const StakingMachine = dContracts.contracts.StakingMachine;
    amount = new BigNumber(amount);

    const estimateGas = await StakingMachine.methods
        .deposit(
            toContractPrecisionDecimals(amount, tokenDecimals),
            Web3.utils.toChecksumAddress(address)
        )
        .estimateGas({ from: account, value: "0x" });

    const receipt = StakingMachine.methods
        .deposit(
            toContractPrecisionDecimals(amount, tokenDecimals),
            Web3.utils.toChecksumAddress(address)
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

const unStake = async (interfaceContext, amount, onTransaction, onReceipt) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;
    const tokenDecimals = settings.tokens.TG[0].decimals;

    const StakingMachine = dContracts.contracts.StakingMachine;
    amount = new BigNumber(amount);

    const estimateGas = await StakingMachine.methods
        .withdraw(toContractPrecisionDecimals(amount, tokenDecimals))
        .estimateGas({ from: account, value: "0x" });

    const receipt = StakingMachine.methods
        .withdraw(toContractPrecisionDecimals(amount, tokenDecimals))
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

const delayMachineWithdraw = async (
    interfaceContext,
    idWithdraw,
    onTransaction,
    onReceipt
) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;
    const DelayMachine = dContracts.contracts.DelayMachine;

    const estimateGas = await DelayMachine.methods
        .withdraw(idWithdraw)
        .estimateGas({ from: account, value: "0x" });

    const receipt = DelayMachine.methods
        .withdraw(idWithdraw)
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

const delayMachineCancelWithdraw = async (
    interfaceContext,
    idWithdraw,
    onTransaction,
    onReceipt
) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;
    const DelayMachine = dContracts.contracts.DelayMachine;

    const estimateGas = await DelayMachine.methods
        .cancel(idWithdraw)
        .estimateGas({ from: account, value: "0x" });

    const receipt = DelayMachine.methods
        .cancel(idWithdraw)
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

const approveStakingMachine = async (
    interfaceContext,
    amount,
    onTransaction,
    onReceipt
) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;

    const StakingMachine = dContracts.contracts.StakingMachine;
    const TG = dContracts.contracts.TG;
    const tokenDecimals = settings.tokens.TG[0].decimals;

    amount = new BigNumber(amount);

    const estimateGas = await TG.methods
        .approve(
            StakingMachine.options.address,
            toContractPrecisionDecimals(amount, tokenDecimals)
        )
        .estimateGas({ from: account, value: "0x" });

    const receipt = TG.methods
        .approve(
            StakingMachine.options.address,
            toContractPrecisionDecimals(amount, tokenDecimals)
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

export {
    addStake,
    unStake,
    delayMachineWithdraw,
    delayMachineCancelWithdraw,
    approveStakingMachine,
};
