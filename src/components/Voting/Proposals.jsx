import React, { Fragment, useContext, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Input } from 'antd';
import Web3 from 'web3';

import { useProjectTranslation } from '../../helpers/translations';
import Proposal from './Proposal';
import VotingStatusModal from '../Modals/VotingStatusModal/VotingStatusModal';
import { AuthenticateContext } from '../../context/Auth';
import { formatTimestamp } from '../../helpers/staking';
import PreVote from './PreVote';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { TokenSettings } from '../../helpers/currencies';

function Proposals(props) {
    const { infoVoting, infoUser } = props;

    const emptyProposal = {
        changeContract: ''
    };
    const [actionProposal, setActionProposal] = useState('LIST');
    const [viewProposal, setViewProposal] = useState(emptyProposal);
    const [addProposalAddress, setAddProposalAddress] = useState('');
    const [addProposalAddressError, setAddProposalAddressError] =
        useState(false);
    const [addProposalAddressErrorText, setAddProposalAddressErrorText] =
        useState('');
    const [isOperationModalVisible, setIsOperationModalVisible] =
        useState(false);
    const [txHash, setTxHash] = useState('');
    const [operationStatus, setOperationStatus] = useState('sign');
    const [modalTitle, setModalTitle] = useState('Proposal');
    const [proposalsData, setProposalsData] = useState([]);

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const space = '\u00A0';

    useEffect(() => {
        onValidateSubmitProposal();
    }, [auth]);

    useEffect(() => {
        if (infoVoting['proposals'] != null) {
            refreshProposals();
        }
    }, [infoVoting['proposals']]);

    const searchProposal = (proposalAddress) => {
        let proposal = emptyProposal;
        for (let i = 0; i < proposalsData.length; i++) {
            if (
                proposalsData[i].changeContract.toLowerCase() ===
                proposalAddress.toLowerCase()
            ) {
                proposal = proposalsData[i];
            }
        }
        return proposal;
    };

    const refreshViewProposalData = () => {
        if (viewProposal.changeContract != null) {
            const proposal = searchProposal(viewProposal.changeContract);
            setViewProposal(proposal);
        }
    };

    const refreshProposals = () => {
        const propData = [];
        let count = 0;
        const nowTimestamp = new BigNumber(Date.now());
        let expirationTimestamp = 0;
        let votesPositivePCT = new BigNumber(0);
        let votesPositive = new BigNumber(0);
        let votingRound = new BigNumber(0);
        const showLastRoundProposal = true;

        let lenProp = 0;
        if (infoVoting['proposals'] != null)
            lenProp = Object.keys(infoVoting['proposals']).length;
        for (let i = 0; i < lenProp; i++) {
            if (infoVoting['proposals'][i] != null) {
                expirationTimestamp = new BigNumber(
                    infoVoting['proposals'][i].expirationTimeStamp
                ).times(1000);
                let expired = true;
                if (expirationTimestamp.gt(nowTimestamp)) expired = false;

                let canUnregister = false;
                if (
                    new BigNumber(infoVoting['proposals'][i].votingRound).lt(
                        infoVoting['globalVotingRound']
                    )
                )
                    canUnregister = true;

                votingRound = new BigNumber(
                    infoVoting['proposals'][i].votingRound
                );
                if (
                    votingRound.lt(infoVoting['globalVotingRound']) &&
                    showLastRoundProposal
                )
                    continue;

                votesPositive = new BigNumber(
                    Web3.utils.fromWei(
                        infoVoting['proposals'][i].votes,
                        'ether'
                    )
                );

                votesPositivePCT = votesPositive
                    .times(100)
                    .div(infoVoting['totalSupply']);

                let canRunStep = false;
                if (
                    votesPositivePCT.gte(
                        infoVoting['PRE_VOTE_MIN_PCT_TO_WIN']
                    ) &&
                    infoVoting['readyToPreVoteStep'] === 1
                )
                    canRunStep = true;

                propData.push({
                    id: count,
                    changeContract: infoVoting['proposals'][i].proposalAddress,
                    votingRound: new BigNumber(
                        infoVoting['proposals'][i].votingRound
                    ),
                    votesPositive: votesPositive,
                    votesPositivePCT: votesPositivePCT,
                    expirationTimeStampFormat: formatTimestamp(
                        expirationTimestamp.toNumber()
                    ),
                    expired: expired,
                    canUnregister: canUnregister,
                    canRunStep: canRunStep,
                    canVote: !expired && infoVoting['readyToPreVoteStep'] === 0
                });
                count += 1;
            }
        }
        setProposalsData(propData);

        // Also refresh proposal view data
        refreshViewProposalData();
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
            setAddProposalAddressErrorText(
                // `You need at least ${infoVoting['MIN_STAKE'].toString()} amount of tokens to submit the proposal`
                'Not enough balance. See below.'
            );
            setAddProposalAddressError(true);
            return false;
        } else return true;
    };

    const addProposal = () => {
        const valid = onValidateAddressProposal() && onValidateSubmitProposal();
        if (valid) {
            onSendAddProposal()
                .then((res) => {})
                .catch((e) => {
                    console.error(e);
                });
        }
    };

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

    const onSendAddProposal = async (e) => {
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
            /*
            // Events name list
            const filter = [
                'OperationError',
                'UnhandledError',
                'OperationQueued',
                'OperationExecuted'
            ];

            const contractName = 'MocQueue';

            const txRcp = await auth.web3.eth.getTransactionReceipt(
                receipt.transactionHash
            );
            const filteredEvents = decodeEvents(txRcp, contractName, filter);
             */
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
                auth.loadContractsStatusAndUserBalance().then((value) => {
                    console.log('Refresh user balance OK!');
                });
            })
            .catch((e) => {
                console.error(e);
                setOperationStatus('error');
            });
    };

    const onViewProposal = (changerAddr) => {
        const proposal = searchProposal(changerAddr);
        setViewProposal(proposal);
        setActionProposal('VIEW_PROPOSAL');
    };

    const onBackToProposalList = () => {
        setViewProposal(emptyProposal);
        setActionProposal('LIST');
    };

    const onSendUnRegister = async (proposalAddress) => {
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
            /*
            // Events name list
            const filter = [
                'OperationError',
                'UnhandledError',
                'OperationQueued',
                'OperationExecuted'
            ];

            const contractName = 'MocQueue';

            const txRcp = await auth.web3.eth.getTransactionReceipt(
                receipt.transactionHash
            );
            const filteredEvents = decodeEvents(txRcp, contractName, filter);
             */
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
                auth.loadContractsStatusAndUserBalance().then((value) => {
                    console.log('Refresh user balance OK!');
                });
            })
            .catch((e) => {
                console.error(e);
                setOperationStatus('error');
            });
    };

    const onUnRegisterProposal = (proposalAddress) => {
        onSendUnRegister(proposalAddress)
            .then((res) => {})
            .catch((e) => {
                console.error(e);
            });
    };

    const onRunPreVoteStep = async () => {
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
            /*
            // Events name list
            const filter = [
                'OperationError',
                'UnhandledError',
                'OperationQueued',
                'OperationExecuted'
            ];

            const contractName = 'MocQueue';

            const txRcp = await auth.web3.eth.getTransactionReceipt(
                receipt.transactionHash
            );
            const filteredEvents = decodeEvents(txRcp, contractName, filter);
             */
        };
        const onError = (error) => {
            console.log('Transaction pre vote step error!...:', error);
            setOperationStatus('error');
        };

        await auth
            .interfaceVotingPreVoteStep(onTransaction, onReceipt, onError)
            .then((res) => {
                // Refresh status
                auth.loadContractsStatusAndUserBalance().then((value) => {
                    console.log('Refresh user balance OK!');
                });
            })
            .catch((e) => {
                console.error(e);
                setOperationStatus('error');
            });
    };

    return (
        <Fragment>
            {/* STATUS */}
            {actionProposal === 'LIST' && (
                <div className="votingStatus">
                    <div className="votingStatus__title">
                        {t('voting.status.title')}
                    </div>
                    {actionProposal === 'LIST' &&
                        proposalsData.length === 0 && (
                            <div className="votingStatus__round">
                                {t('voting.status.openForSubmissions')}
                            </div>
                        )}
                    {actionProposal === 'LIST' && proposalsData.length > 0 && (
                        <div className="votingStatus__round">
                            {t('voting.status.active')}
                        </div>
                    )}
                    {actionProposal === 'LIST' &&
                        proposalsData.length > 0 &&
                        infoVoting['readyToPreVoteStep'] === 1 && (
                            <div className="votingStatus__finished">
                                {t('voting.status.firstStageOver')}
                            </div>
                        )}
                </div>
            )}

            <div className="proposalsList__wrapper">
                <div className={'title'}>
                    <h1>{t('voting.cardTitle.proposalsList')}</h1>
                </div>
                {/* PROPOSALS LIST */}
                {actionProposal === 'LIST' &&
                    proposalsData.length > 0 &&
                    proposalsData.map((proposal) => (
                        <>
                            <Proposal
                                proposal={proposal}
                                infoVoting={infoVoting}
                                onViewProposal={onViewProposal}
                                onRunPreVoteStep={onRunPreVoteStep}
                            />
                        </>
                    ))}
                {actionProposal === 'VIEW_PROPOSAL' &&
                    viewProposal.changeContract !== '' && (
                        <>
                            {/* <div className={'title'}>
                                <h1>{t('voting.cardTitle.proposalDetails')}</h1>
                            </div> */}
                            <div className="sectionPreVoting">
                                <PreVote
                                    proposal={viewProposal}
                                    infoVoting={infoVoting}
                                    infoUser={infoUser}
                                    onBack={onBackToProposalList}
                                    onUnRegisterProposal={onUnRegisterProposal}
                                    onRunPreVoteStep={onRunPreVoteStep}
                                />
                            </div>
                        </>
                    )}
                {/* actionProposal === 'LIST' && infoVoting['readyToPreVoteStep'] === 0 && */}
                {actionProposal === 'LIST' &&
                    infoVoting['readyToPreVoteStep'] === 0 && (
                        <>
                            {actionProposal === 'LIST' &&
                                proposalsData.length === 0 && (
                                    <div className="proposals__empty">
                                        {t('voting.feedback.noProposals')}
                                    </div>
                                )}
                            <div
                                className="button__addProposal"
                                onClick={onShowAddProposal}
                            >
                                <div className="icon__addProposal"></div>
                                {t('voting.cta.addNewProposal')}
                            </div>
                        </>
                    )}
                {actionProposal === 'ADD' && (
                    <div className="proposalsContainer">
                        <div className="addProposal">
                            <h2>{t('voting.cardTitle.addNewProposal')}</h2>
                            <div className="inputFields">
                                <div className="tokenSelector">
                                    <div className="amountInput">
                                        <div className="amountInput__infoBar">
                                            <div className="amountInput__label">
                                                {t(
                                                    'voting.labels.proposalChangerContract'
                                                )}
                                            </div>
                                        </div>
                                        <div className="proposal__add__text amountInput__amount">
                                            <Input
                                                type="text"
                                                placeholder="Changer address"
                                                className="proposal__add__input amountInput__value"
                                                onChange={
                                                    onChangeInputAddProposal
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="amountInput__feedback amountInput__feedback--error">
                                        {addProposalAddressError &&
                                            addProposalAddressErrorText !==
                                                '' && (
                                                <div
                                                    className={
                                                        'input-error amountInput__feedback amountInput__feedback--error'
                                                    }
                                                >
                                                    {
                                                        addProposalAddressErrorText
                                                    }
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                            <div className="cta-container">
                                <div className="cta-info-group">
                                    <div className="cta-info-detail">
                                        {t('voting.feedback.stakeRequiered1')}
                                        {space}
                                        {PrecisionNumbers({
                                            amount: infoVoting['MIN_STAKE'],
                                            token: TokenSettings('TG'),
                                            decimals: 2,
                                            t: t,
                                            i18n: i18n,
                                            ns: ns,
                                            skipContractConvert: true
                                        })}
                                        {space}{' '}
                                        {t('voting.feedback.stakeRequiered2')}
                                    </div>
                                    <div className="cta-info-summary ">
                                        <div className="label">
                                            {t('voting.userPower.votingPower')}
                                        </div>

                                        <div className="data">
                                            {PrecisionNumbers({
                                                amount: infoUser[
                                                    'Voting_Power'
                                                ],
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
                                            {space}(
                                            {PrecisionNumbers({
                                                amount: infoUser[
                                                    'Voting_Power_PCT'
                                                ],
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
                                </div>
                                <div className="cta-options-group">
                                    <button
                                        type="secondary"
                                        className="button secondary"
                                        onClick={onCloseAddProposal}
                                    >
                                        {t('voting.cta.cancel')}
                                    </button>
                                    <button
                                        type="primary"
                                        className="button"
                                        onClick={onAddProposal}
                                        disabled={addProposalAddressError}
                                    >
                                        {t('voting.cta.addProposal')}
                                    </button>
                                </div>
                            </div>
                            <div className="wallet__vesting__options__buttons"></div>

                            <div className="additional-text"></div>
                        </div>
                    </div>
                )}
                {/*{infoVoting['readyToPreVoteStep'] === 1 && (*/}
                {/*    <div className="pre-vote-step">*/}
                {/*        <div className="pre-vote-info">Please run Step to advance to vote stage</div>*/}
                {/*        <button className="button secondary" onClick={onRunPreVoteStep}>*/}
                {/*            Run Step{' '}*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*)}*/}
                {isOperationModalVisible && (
                    <VotingStatusModal
                        title={modalTitle}
                        visible={isOperationModalVisible}
                        onCancel={() => setIsOperationModalVisible(false)}
                        operationStatus={operationStatus}
                        txHash={txHash}
                        proposalChanger={''}
                        votingInFavor={true}
                        showProposal={false}
                    />
                )}
            </div>
        </Fragment>
    );
}

export default Proposals;
