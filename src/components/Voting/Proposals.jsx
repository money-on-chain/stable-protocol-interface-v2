import React, { useContext, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Input } from 'antd';
import Web3 from 'web3';

import { useProjectTranslation } from '../../helpers/translations';
import Proposal from './Proposal';
import OperationStatusModal from '../Modals/OperationStatusModal/OperationStatusModal';
import { AuthenticateContext } from '../../context/Auth';
import { formatTimestamp } from '../../helpers/staking';
import PreVote from './PreVote';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { TokenSettings } from '../../helpers/currencies';


function Proposals(props) {

    const { infoVoting, infoUser } = props;

    const emptyProposal = {
        changeContract: ''
    }
    const [actionProposal, setActionProposal] = useState('LIST');
    const [viewProposal, setViewProposal] = useState(emptyProposal);
    const [addProposalAddress, setAddProposalAddress] = useState('');
    const [addProposalAddressError, setAddProposalAddressError] = useState(false);
    const [addProposalAddressErrorText, setAddProposalAddressErrorText] =
        useState('');
    const [isOperationModalVisible, setIsOperationModalVisible] =
        useState(false);
    const [txHash, setTxHash] = useState('');
    const [operationStatus, setOperationStatus] = useState('sign');
    const [modalTitle, setModalTitle] = useState('Operation status');

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const space = '\u00A0';

    useEffect(() => {
        onValidateSubmitProposal();
    }, [auth]);

    // List proposals
    const proposalsData = [];
    let count = 0;
    const nowTimestamp = new BigNumber(Date.now())
    let expirationTimestamp = 0
    let votesPositivePCT = new BigNumber(0)
    let votesPositive = new BigNumber(0)
    let votingRound = new BigNumber(0)
    const showLastRoundProposal = true

    let lenProp = 0
    if (infoVoting['proposals'] != null) lenProp = Object.keys(infoVoting['proposals']).length;
    for (let i = 0; i < lenProp; i++) {
        if (infoVoting['proposals'][i] !== null) {

            expirationTimestamp = new BigNumber(infoVoting['proposals'][i].expirationTimeStamp).times(1000)
            let expired = true
            if (expirationTimestamp.gt(nowTimestamp)) expired = false

            let canUnregister = false
            if (new BigNumber(infoVoting['proposals'][i].votingRound).lt(
                infoVoting['globalVotingRound'])) canUnregister = true

            votingRound = new BigNumber(infoVoting['proposals'][i].votingRound)
            if (votingRound.lt(infoVoting['globalVotingRound']) && showLastRoundProposal) continue

            votesPositive = new BigNumber(
                Web3.utils.fromWei(
                    infoVoting['proposals'][i].votes,
                    'ether'
                )
            );

            votesPositivePCT = votesPositive.times(100).div(infoVoting['totalSupply'])

            let canRunStep = false
            if (votesPositivePCT.gte(infoVoting['PRE_VOTE_MIN_PCT_TO_WIN'])
                && infoVoting['readyToPreVoteStep'] === 1) canRunStep = true

            proposalsData.push({
                id: count,
                changeContract: infoVoting['proposals'][i].proposalAddress,
                votingRound: new BigNumber(infoVoting['proposals'][i].votingRound),
                votesPositive: votesPositive,
                votesPositivePCT: votesPositivePCT,
                expirationTimeStampFormat: formatTimestamp(expirationTimestamp.toNumber()),
                expired: expired,
                canUnregister: canUnregister,
                canRunStep: canRunStep,
                canVote: !expired && infoVoting['readyToPreVoteStep'] === 0
            });
            count += 1
        }
    }

    const searchProposal = (proposalAddress) => {
        let proposal = emptyProposal
        for (let i = 0; i < proposalsData.length; i++) {
            if (proposalsData[i].changeContract.toLowerCase()===proposalAddress.toLowerCase()) {
                proposal = proposalsData[i]
            }
        }
        return proposal
    };

    const onChangeInputAddProposal = (e) => {
        setAddProposalAddress(e.target.value.toLowerCase());
        onValidateAddProposalClear();
    };

    const onValidateAddProposalClear = () => {
        setAddProposalAddressErrorText('');
        setAddProposalAddressError(false);
    };

    const onValidateAddressProposal = () => {
        // 1. Input address valid
        if (addProposalAddress === '') {
            setAddProposalAddressErrorText('Proposal address can not be empty');
            setAddProposalAddressError(true);
            return false;
        } else if (
            addProposalAddress.length < 42 ||
            addProposalAddress.length > 42
        ) {
            setAddProposalAddressErrorText('Not valid input proposal address');
            setAddProposalAddressError(true);
            return false;
        }

        return true;
    };

    const onValidateSubmitProposal = () => {
         if (infoUser['Voting_Power'].lt(infoVoting['MIN_STAKE'])) {
            setAddProposalAddressErrorText(`You need at least ${infoVoting['MIN_STAKE'].toString()} amount of tokens to submit the proposal`);
            setAddProposalAddressError(true);
            return false;
        } else return true;
    };

    const addProposal = () => {
        const valid = onValidateAddressProposal() && onValidateSubmitProposal()
        if (valid) {
            onSendAddProposal().then((res) => {
            })
            .catch((e) => {
                console.error(e);
            });
        }
    }

    const onAddProposal = (e) => {
        e.stopPropagation();
        addProposal();
    };

    const onShowAddProposal = (e) => {
        e.stopPropagation();
        setActionProposal('ADD');
    };

    const onCloseAddProposal = () => {
        setActionProposal('LIST');
    };

    const onSendAddProposal= async (e) => {
        setModalTitle('Adding proposal');

        setOperationStatus('sign');
        setIsOperationModalVisible(true);

        const onTransaction = (txHash) => {
            console.log('Sent transaction add proposal...: ', txHash);
            setTxHash(txHash);
            setOperationStatus('pending');
        };
        const onReceipt = (receipt) => {
            console.log('Transaction add proposal mined!...');
            setOperationStatus('success');
            const filteredEvents = auth.interfaceDecodeEvents(receipt);
            onCloseAddProposal();
        };
        const onError = (error) => {
            console.log('Transaction add proposal error!...:', error);
            setOperationStatus('error');
        };

        await auth
            .interfaceVotingPreVote(
                addProposalAddress,
                onTransaction,
                onReceipt,
                onError
            )
            .then((res) => {
                // Refresh status
                auth.loadContractsStatusAndUserBalance().then(
                    (value) => {
                        console.log('Refresh user balance OK!');
                    }
                );
            })
            .catch((e) => {
                console.error(e);
                setOperationStatus('error');
            });
    };

    const onViewProposal = (changerAddr) => {
        const proposal = searchProposal(changerAddr)
        setViewProposal(proposal);
        setActionProposal('VIEW_PROPOSAL');
    };

    const onBackToProposalList = () => {
        setViewProposal(emptyProposal);
        setActionProposal('LIST');
    };

    const onSendUnRegister= async (proposalAddress) => {
        setModalTitle('Unregister proposal');

        setOperationStatus('sign');
        setIsOperationModalVisible(true);

        const onTransaction = (txHash) => {
            console.log('Sent transaction unregister proposal...: ', txHash);
            setTxHash(txHash);
            setOperationStatus('pending');
        };
        const onReceipt = (receipt) => {
            console.log('Transaction unregister proposal mined!...');
            setOperationStatus('success');
            const filteredEvents = auth.interfaceDecodeEvents(receipt);
        };
        const onError = (error) => {
            console.log('Transaction unregister proposal error!...:', error);
            setOperationStatus('error');
        };

        await auth
            .interfaceVotingUnRegister(
                proposalAddress,
                onTransaction,
                onReceipt,
                onError
            )
            .then((res) => {
                // Refresh status
                auth.loadContractsStatusAndUserBalance().then(
                    (value) => {
                        console.log('Refresh user balance OK!');
                    }
                );
            })
            .catch((e) => {
                console.error(e);
                setOperationStatus('error');
            });
    };

    const onUnRegisterProposal = (proposalAddress) => {
        onSendUnRegister(proposalAddress).then((res) => {
        })
        .catch((e) => {
            console.error(e);
        });
    }

    const onRunPreVoteStep= async () => {
        setModalTitle('Pre-vote Step');

        setOperationStatus('sign');
        setIsOperationModalVisible(true);

        const onTransaction = (txHash) => {
            console.log('Sent transaction pre vote step ...: ', txHash);
            setTxHash(txHash);
            setOperationStatus('pending');
        };
        const onReceipt = (receipt) => {
            console.log('Transaction pre vote step mined!...');
            setOperationStatus('success');
            const filteredEvents = auth.interfaceDecodeEvents(receipt);
        };
        const onError = (error) => {
            console.log('Transaction pre vote step error!...:', error);
            setOperationStatus('error');
        };

        await auth
            .interfaceVotingPreVoteStep(
                onTransaction,
                onReceipt,
                onError
            )
            .then((res) => {
                // Refresh status
                auth.loadContractsStatusAndUserBalance().then(
                    (value) => {
                        console.log('Refresh user balance OK!');
                    }
                );
            })
            .catch((e) => {
                console.error(e);
                setOperationStatus('error');
            });
    };



    return (
    <div className="proposal__wrapper">

        {/* PRE-VOTE - VIEW PROPOSAL */}
        {actionProposal === 'VIEW_PROPOSAL' && viewProposal.changeContract !== '' && (
            <div className="section preVoting">
                <PreVote
                    proposal={viewProposal}
                    infoVoting={infoVoting}
                    infoUser={infoUser}
                    onBack={onBackToProposalList}
                    onUnRegisterProposal={onUnRegisterProposal}
                    onRunPreVoteStep={onRunPreVoteStep}
                />
            </div>
        )}

        {/* actionProposal === 'LIST' && infoVoting['readyToPreVoteStep'] === 0 && */}
        {actionProposal === 'LIST' && infoVoting['readyToPreVoteStep'] === 0 && (
            <div className="new-proposal">
                <button className="button secondary" onClick={onShowAddProposal}>
                    Add proposal{' '}
                </button>
            </div>
        )}

        {actionProposal === 'ADD' && (
            <div className='proposal__add__options'>
                <div className='proposal__add__label'>
                    New Proposal
                </div>
                <div className='proposal__add__text'>
                    <Input
                        type='text'
                        placeholder='changer address'
                        className='proposal__add__input'
                        onChange={onChangeInputAddProposal}
                    />
                    {addProposalAddressError &&
                        addProposalAddressErrorText !== '' && (
                            <div className={'input-error'}>
                                {addProposalAddressErrorText}
                            </div>
                        )}
                </div>
                <div className='wallet__vesting__options__buttons'>
                    <button
                        type='secondary'
                        className='button secondary button__small btn-clear'
                        onClick={onCloseAddProposal}
                    >
                        Cancel
                    </button>
                    <button
                        type='primary'
                        className='button secondary button__small btn-confirm'
                        onClick={onAddProposal}
                        disabled={addProposalAddressError}
                    >
                        Add
                    </button>
                </div>
                <div className='voting-power'>

                    <div className='label'>
                        {t('voting.userPower.votingPower')}
                    </div>

                    <div className='data'>
                        {PrecisionNumbers({
                            amount: infoUser['Voting_Power'],
                            token: TokenSettings('TG'),
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}

                        {space}

                        {t('staking.tokens.TG.abbr', {
                            ns: ns
                        })}

                        {space}

                        (
                        {PrecisionNumbers({
                            amount: infoUser['Voting_Power_PCT'],
                            token: TokenSettings('TG'),
                            decimals: 4,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                        % )
                    </div>

                </div>
                <div className='additional-text'>
                    Please write the proposal Address, you need at least {space}
                    {PrecisionNumbers({
                        amount: infoVoting['MIN_STAKE'],
                        token: TokenSettings('TG'),
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: true
                    })} amount of tokens to submit the proposal.
                </div>
            </div>)}


        {actionProposal === 'LIST' && proposalsData.length === 0 && (
            <div className='proposals__empty'>
                Proposal list is empty. Add a proposal!
            </div>
        )}

        {actionProposal === 'LIST' && proposalsData.length > 0 && (
            <div className="proposals__voting__round">
                Proposals voting round Nº {' '} {infoVoting['globalVotingRound'].toNumber()}
            </div>
        )}

        {actionProposal === 'LIST' && proposalsData.length > 0 && infoVoting['readyToPreVoteStep'] === 1 && (
            <div className="proposals__voting__over">
                The first stage voting period is over!
            </div>
        )}

        {actionProposal === 'LIST' && proposalsData.length > 0 && proposalsData.map((proposal) => (
            <Proposal
                proposal={proposal}
                infoVoting={infoVoting}
                onViewProposal={onViewProposal}
                onRunPreVoteStep={onRunPreVoteStep}
            />
        ))}

        {/*{infoVoting['readyToPreVoteStep'] === 1 && (*/}
        {/*    <div className="pre-vote-step">*/}
        {/*        <div className="pre-vote-info">Please run Step to advance to vote stage</div>*/}
        {/*        <button className="button secondary" onClick={onRunPreVoteStep}>*/}
        {/*            Run Step{' '}*/}
        {/*        </button>*/}
        {/*    </div>*/}
        {/*)}*/}

        {isOperationModalVisible && (
            <OperationStatusModal
                title={modalTitle}
                visible={isOperationModalVisible}
                onCancel={() => setIsOperationModalVisible(false)}
                operationStatus={operationStatus}
                txHash={txHash}
            />
        )}

    </div>
)
    ;
}

export default Proposals;
