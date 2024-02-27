import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import settings from '../../settings/settings.json';
import { toContractPrecision, getGasPrice, toContractPrecisionDecimals } from './utils';

const stackedBalance = async (address) => {
    const dContracts = window.dContracts;
    const istakingmachine = dContracts.contracts.istakingmachine;
    return await istakingmachine.methods.getBalance(Web3.utils.toChecksumAddress(address)).call();
};

const lockedBalance = async (address) => {
    const dContracts = window.dContracts;
    const istakingmachine = dContracts.contracts.istakingmachine;
    return await istakingmachine.methods.getLockedBalance(Web3.utils.toChecksumAddress(address)).call();
};

const pendingWithdrawals = async (address) => {
    const dContracts = window.dContracts;
    const idelaymachine = dContracts.contracts.idelaymachine;
    const { ids, amounts, expirations } = await idelaymachine.methods
        .getTransactions(Web3.utils.toChecksumAddress(address))
        .call();
    const withdraws = [];
    for (let i = 0; i < ids.length; i++) {
        withdraws.push({
            id: ids[i],
            amount: amounts[i],
            expiration: expirations[i]
        });
    }
    return withdraws;
};

const stakingDeposit = async (interfaceContext, amount, address, callback) => {
    const { web3, account, userBalanceData } = interfaceContext;
    const dContracts = window.dContracts;

    const istakingmachine = dContracts.contracts.istakingmachine;

    amount = new BigNumber(amount);

    // Calculate estimate gas cost
    const estimateGas = await istakingmachine.methods
        .deposit(toContractPrecision(amount), Web3.utils.toChecksumAddress(address))
        .estimateGas({ from: account });

    // Send tx
    const receipt = istakingmachine.methods
        .deposit(toContractPrecision(amount), Web3.utils.toChecksumAddress(address))
        .send(
            {
                from: account,
                gasPrice: await getGasPrice(web3),
                gas: estimateGas * BigInt(2),
                gasLimit: estimateGas * BigInt(2)
            },
            callback
        );

    return receipt;
};

const unStake = async (interfaceContext, amount, callback) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;

    const istakingmachine = dContracts.contracts.istakingmachine;

    amount = new BigNumber(amount);

    // Calculate estimate gas cost
    const estimateGas = await istakingmachine.methods
        .withdraw(toContractPrecision(amount))
        .estimateGas({ from: account });

    // Send tx
    const receipt = istakingmachine.methods
        .withdraw(toContractPrecision(amount))
        .send(
            {
                from: account,
                gasPrice: await getGasPrice(web3),
                gas: estimateGas * 2,
                gasLimit: estimateGas * 2
            },
            callback
        );

    return receipt;
};

const delayMachineWithdraw = async (interfaceContext, id, callback) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;

    const idelaymachine = dContracts.contracts.idelaymachine;

    // Calculate estimate gas cost
    const estimateGas = await idelaymachine.methods
        .withdraw(id)
        .estimateGas({ from: account });

    // Send tx
    const receipt = idelaymachine.methods.withdraw(id).send(
        {
            from: account,
            gasPrice: await getGasPrice(web3),
            gas: estimateGas * 2,
            gasLimit: estimateGas * 2
        },
        callback
    );

    return receipt;
};

const delayMachineCancelWithdraw = async (interfaceContext, id, callback) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;

    const idelaymachine = dContracts.contracts.idelaymachine;

    // Calculate estimate gas cost
    const estimateGas = await idelaymachine.methods
        .cancel(id)
        .estimateGas({ from: account });

    // Send tx
    const receipt = idelaymachine.methods.cancel(id).send(
        {
            from: account,
            gasPrice: await getGasPrice(web3),
            gas: estimateGas * 2,
            gasLimit: estimateGas * 2
        },
        callback
    );

    return receipt;
};

const approveMoCTokenStaking = async (interfaceContext, enabled, callback) => {
    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;

    const stakingAddress = dContracts.contracts.istakingmachine._address;
    const tg = dContracts.contracts.tg;

    const newAllowance = enabled
        ? new BigNumber(1000000000000000)
        : 0;

    const estimateGas = await tg.methods
        .approve(
            stakingAddress,
            toContractPrecisionDecimals(newAllowance, settings.tokens.TF.decimals)
        )
        .estimateGas({ from: account, value: '0x' });
    console.log('estimateGas', estimateGas);
    // Send tx
    const receipt = tg.methods.approve(
        stakingAddress,
        toContractPrecisionDecimals(newAllowance, settings.tokens.TF.decimals)
    ).send(
        {
            from: account,
            value: 0,
            gasPrice: await getGasPrice(web3),
            gas: estimateGas * BigInt(2),
            gasLimit: estimateGas * BigInt(2)
        },
        callback
    );
    console.log('receipt', receipt);
    return receipt;
};

const getMoCAllowance = async (address) => {
    const dContracts = window.dContracts;
    const tg = dContracts.contracts.tg;
    console.log('tg', tg);
    const stakingAddress = dContracts.contracts.istakingmachine._address;
    return await tg.methods.allowance(Web3.utils.toChecksumAddress(address), stakingAddress).call();
};

export {
    stackedBalance,
    lockedBalance,
    pendingWithdrawals,
    stakingDeposit,
    unStake,
    delayMachineWithdraw,
    delayMachineCancelWithdraw,
    approveMoCTokenStaking,
    getMoCAllowance
};
