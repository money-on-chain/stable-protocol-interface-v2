import BigNumber from 'bignumber.js';
import { getGasPrice, toContractPrecision } from '../utils';
import Web3 from 'web3';


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

    const { web3, account, userBalanceData } = interfaceContext;
    const dContracts = window.dContracts;

    const VestingMachine = dContracts.contracts.VestingMachine;
    amount = new BigNumber(amount);

    const estimateGas = await VestingMachine.methods
        .approve(toContractPrecision(amount))
        .estimateGas({ from: account, value: '0x'  });

    const receipt = VestingMachine.methods
        .approve(toContractPrecision(amount))
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

    const VestingMachine = dContracts.contracts.VestingMachine;
    amount = new BigNumber(amount);

    const estimateGas = await VestingMachine.methods
        .deposit(toContractPrecision(amount))
        .estimateGas({ from: account, value: '0x'  });

    const receipt = VestingMachine.methods
        .deposit(toContractPrecision(amount))
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

    const { web3, account, userBalanceData } = interfaceContext;
    const dContracts = window.dContracts;

    const VestingMachine = dContracts.contracts.VestingMachine;
    amount = new BigNumber(amount);

    const estimateGas = await VestingMachine.methods
        .withdraw(toContractPrecision(amount))
        .estimateGas({ from: account, value: '0x'  });

    const receipt = VestingMachine.methods
        .withdraw(toContractPrecision(amount))
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
                gas: estimateGas,
                gasLimit: estimateGas
            }
        )
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt;
};


const addStake = async (interfaceContext, amount, address, onTransaction, onReceipt) => {

    const dContracts = window.dContracts;
    const StakingMachine = dContracts.contracts.StakingMachine;
    amount = new BigNumber(amount);

    const target = StakingMachine.options.address
    const data = StakingMachine.methods.deposit(toContractPrecision(amount),
        Web3.utils.toChecksumAddress(address)).encodeABI()

    const receipt = _callWithData(interfaceContext, target, data, onTransaction, onReceipt)

    return receipt;
};


const unStake = async (interfaceContext, amount, onTransaction, onReceipt) => {

    const dContracts = window.dContracts;
    const StakingMachine = dContracts.contracts.StakingMachine;
    amount = new BigNumber(amount);

    const target = StakingMachine.options.address
    const data = StakingMachine.methods.withdraw(toContractPrecision(amount)).encodeABI()

    const receipt = _callWithData(interfaceContext, target, data, onTransaction, onReceipt)

    return receipt;
};


const cancelWithdrawDelay = async (interfaceContext, idWithdraw, onTransaction, onReceipt) => {

    const dContracts = window.dContracts;
    const DelayMachine = dContracts.contracts.DelayMachine;

    const target = DelayMachine.options.address
    const data = DelayMachine.methods.cancel(idWithdraw).encodeABI()

    const receipt = _callWithData(interfaceContext, target, data, onTransaction, onReceipt)

    return receipt;
};


const withdrawDelay = async (interfaceContext, idWithdraw, onTransaction, onReceipt) => {

    const dContracts = window.dContracts;
    const DelayMachine = dContracts.contracts.DelayMachine;

    const target = DelayMachine.options.address
    const data = DelayMachine.methods.withdraw(idWithdraw).encodeABI()

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
    cancelWithdrawDelay,
    withdrawDelay
};
