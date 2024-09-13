import BigNumber from 'bignumber.js';
import { getGasPrice, toContractPrecisionDecimals } from '../utils';
import Web3 from 'web3';
import settings from '../../../settings/settings.json';


const vestingVerify = async (interfaceContext, onTransaction, onReceipt) => {

    const { web3, account, userBalanceData } = interfaceContext;
    const dContracts = window.dContracts;

    const VestingMachine = dContracts.contracts.VestingMachine;

    const estimateGas = await VestingMachine.methods
        .verify()
        .estimateGas({ from: account, value: '0x'  });

    const receipt = VestingMachine.methods
        .verify()
        .send(
            {
                from: account,
                value: 0,
                gasPrice: await getGasPrice(web3),
                gas: estimateGas,
                gasLimit: estimateGas
            }
        )
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt;
};


const approve = async (interfaceContext, amount, onTransaction, onReceipt) => {

    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;
    const tokenDecimals = settings.tokens.TG.decimals

    const VestingMachine = dContracts.contracts.VestingMachine;
    amount = new BigNumber(amount);

    const estimateGas = await VestingMachine.methods
        .approve(toContractPrecisionDecimals(amount, tokenDecimals))
        .estimateGas({ from: account, value: '0x'  });

    const receipt = VestingMachine.methods
        .approve(toContractPrecisionDecimals(amount, tokenDecimals))
        .send(
            {
                from: account,
                value: 0,
                gasPrice: await getGasPrice(web3),
                gas: estimateGas,
                gasLimit: estimateGas
            }
        )
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt;
};


const deposit = async (interfaceContext, amount, onTransaction, onReceipt) => {

    const { web3, account, userBalanceData } = interfaceContext;
    const dContracts = window.dContracts;
    const tokenDecimals = settings.tokens.TG.decimals
    const VestingMachine = dContracts.contracts.VestingMachine;

    amount = new BigNumber(amount);

    const estimateGas = await VestingMachine.methods
        .deposit(toContractPrecisionDecimals(amount, tokenDecimals))
        .estimateGas({ from: account, value: '0x'  });

    const receipt = VestingMachine.methods
        .deposit(toContractPrecisionDecimals(amount, tokenDecimals))
        .send(
            {
                from: account,
                value: 0,
                gasPrice: await getGasPrice(web3),
                gas: estimateGas,
                gasLimit: estimateGas
            }
        )
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt;
};

const withdraw = async (interfaceContext, amount, onTransaction, onReceipt) => {

    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;
    const tokenDecimals = settings.tokens.TG.decimals;
    const VestingMachine = dContracts.contracts.VestingMachine;

    amount = new BigNumber(amount);

    const estimateGas = await VestingMachine.methods
        .withdraw(toContractPrecisionDecimals(amount, tokenDecimals))
        .estimateGas({ from: account, value: '0x'  });

    const receipt = VestingMachine.methods
        .withdraw(toContractPrecisionDecimals(amount, tokenDecimals))
        .send(
            {
                from: account,
                value: 0,
                gasPrice: await getGasPrice(web3),
                gas: estimateGas,
                gasLimit: estimateGas
            }
        )
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt;
};


const withdrawAll = async (interfaceContext, onTransaction, onReceipt) => {

    const { web3, account, userBalanceData } = interfaceContext;
    const dContracts = window.dContracts;

    const VestingMachine = dContracts.contracts.VestingMachine;

    const estimateGas = await VestingMachine.methods
        .withdrawAll()
        .estimateGas({ from: account, value: '0x'  });

    const receipt = VestingMachine.methods
        .withdrawAll()
        .send(
            {
                from: account,
                value: 0,
                gasPrice: await getGasPrice(web3),
                gas: estimateGas,
                gasLimit: estimateGas
            }
        )
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt;
};


const _callWithData = async (interfaceContext, target, data, onTransaction, onReceipt) => {

    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;

    const VestingMachine = dContracts.contracts.VestingMachine;

    const estimateGas = await VestingMachine.methods
        .callWithData(target, data)
        .estimateGas({ from: account, value: '0x'  });

    const receipt = VestingMachine.methods
        .callWithData(target, data)
        .send(
            {
                from: account,
                value: 0,
                gasPrice: await getGasPrice(web3),
                gas: estimateGas * BigInt(2),
                gasLimit: estimateGas * BigInt(2)
            }
        )
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt;
};


const addStake = async (interfaceContext, amount, address, onTransaction, onReceipt) => {

    const dContracts = window.dContracts;
    const StakingMachine = dContracts.contracts.StakingMachine;
    const VestingMachine = dContracts.contracts.VestingMachine
    const tokenDecimals = settings.tokens.TG.decimals

    amount = new BigNumber(amount);

    const target = Web3.utils.toChecksumAddress(StakingMachine.options.address)
    const data = StakingMachine.methods.deposit(toContractPrecisionDecimals(amount, tokenDecimals),
        Web3.utils.toChecksumAddress(VestingMachine.options.address)).encodeABI()

    const receipt = _callWithData(interfaceContext, target, data, onTransaction, onReceipt)

    return receipt;
};


const unStake = async (interfaceContext, amount, onTransaction, onReceipt) => {

    const dContracts = window.dContracts;
    const StakingMachine = dContracts.contracts.StakingMachine;
    const tokenDecimals = settings.tokens.TG.decimals

    amount = new BigNumber(amount);

    const target = Web3.utils.toChecksumAddress(StakingMachine.options.address)
    const data = StakingMachine.methods.withdraw(toContractPrecisionDecimals(amount, tokenDecimals)).encodeABI()

    const receipt = _callWithData(interfaceContext, target, data, onTransaction, onReceipt)

    return receipt;
};


const delayMachineCancelWithdraw = async (interfaceContext, idWithdraw, onTransaction, onReceipt) => {

    const dContracts = window.dContracts;
    const DelayMachine = dContracts.contracts.DelayMachine;

    const target = Web3.utils.toChecksumAddress(DelayMachine.options.address)
    const data = DelayMachine.methods.cancel(idWithdraw).encodeABI()

    const receipt = _callWithData(interfaceContext, target, data, onTransaction, onReceipt)

    return receipt;
};


const delayMachineWithdraw = async (interfaceContext, idWithdraw, onTransaction, onReceipt) => {

    const dContracts = window.dContracts;
    const DelayMachine = dContracts.contracts.DelayMachine;

    const target = Web3.utils.toChecksumAddress(DelayMachine.options.address)
    const data = DelayMachine.methods.withdraw(idWithdraw).encodeABI()

    const receipt = _callWithData(interfaceContext, target, data, onTransaction, onReceipt)

    return receipt;
};


const approveStakingMachine = async (interfaceContext, amount, onTransaction, onReceipt) => {

    const dContracts = window.dContracts;

    const StakingMachine = dContracts.contracts.StakingMachine;
    const TG = dContracts.contracts.TG;
    const tokenDecimals = settings.tokens.TG.decimals

    amount = new BigNumber(amount);

    const target = Web3.utils.toChecksumAddress(TG.options.address)
    const data = TG.methods
        .approve(Web3.utils.toChecksumAddress(StakingMachine.options.address),
            toContractPrecisionDecimals(amount, tokenDecimals)).encodeABI()

    const receipt = _callWithData(interfaceContext, target, data, onTransaction, onReceipt)

    return receipt;
};



export {
    vestingVerify,
    approve,
    deposit,
    withdraw,
    withdrawAll,
    addStake,
    unStake,
    delayMachineCancelWithdraw,
    delayMachineWithdraw,
    approveStakingMachine
};
