import settings from '../../../settings/settings.json';
import BigNumber from 'bignumber.js';
import { getGasPrice, toContractPrecisionDecimals } from '../utils';
import Web3 from 'web3';


const preVote = async (interfaceContext, changeContractAddress, onTransaction, onReceipt) => {

    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;
    const VotingMachine = dContracts.contracts.VotingMachine;

    const estimateGas = await VotingMachine.methods
        .deposit(Web3.utils.toChecksumAddress(changeContractAddress))
        .estimateGas({ from: account, value: '0x'  });

    const receipt = VotingMachine.methods
        .deposit(Web3.utils.toChecksumAddress(changeContractAddress))
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

const vote = async (interfaceContext, inFavorAgainst, onTransaction, onReceipt) => {

    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;
    const VotingMachine = dContracts.contracts.VotingMachine;

    const estimateGas = await VotingMachine.methods
        .vote(inFavorAgainst)
        .estimateGas({ from: account, value: '0x'  });

    const receipt = VotingMachine.methods
        .vote(inFavorAgainst)
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

const preVoteStep = async (interfaceContext, onTransaction, onReceipt) => {

    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;
    const VotingMachine = dContracts.contracts.VotingMachine;

    const estimateGas = await VotingMachine.methods
        .preVoteStep()
        .estimateGas({ from: account, value: '0x'  });

    const receipt = VotingMachine.methods
        .preVoteStep()
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

const voteStep = async (interfaceContext, onTransaction, onReceipt) => {

    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;
    const VotingMachine = dContracts.contracts.VotingMachine;

    const estimateGas = await VotingMachine.methods
        .voteStep()
        .estimateGas({ from: account, value: '0x'  });

    const receipt = VotingMachine.methods
        .voteStep()
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


const acceptedStep = async (interfaceContext, onTransaction, onReceipt) => {

    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;
    const VotingMachine = dContracts.contracts.VotingMachine;

    const estimateGas = await VotingMachine.methods
        .acceptedStep()
        .estimateGas({ from: account, value: '0x'  });

    const receipt = VotingMachine.methods
        .acceptedStep()
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

export {
    preVote,
    vote,
    preVoteStep,
    voteStep,
    acceptedStep
};
