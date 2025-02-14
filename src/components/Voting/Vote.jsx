import React, { Fragment, useContext, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';

import { useProjectTranslation } from '../../helpers/translations';
import CompletedBar from './CompletedBar';
import BalanceBar from './BalanceBar';
import { AuthenticateContext } from '../../context/Auth';
import VotingStatusModal from '../Modals/VotingStatusModal/VotingStatusModal';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { TokenSettings } from '../../helpers/currencies';


function CreateBarGraph(props) {
    return (
        <CompletedBar
            key={props.id}
            description={props.description}
            percentage={props.percentage}
            needed={props.needed}
            type={props.type}
            // labelCurrent={props.labelCurrent}
            // labelNeedIt={props.labelNeedIt}
            // labelTotal={props.labelTotal}
            // valueCurrent={props.valueCurrent}
            // valueNeedIt={props.valueNeedIt}
            // valueTotal={props.valueTotal}
            // pctCurrent={props.pctCurrent}
            // pctNeedIt={props.pctNeedIt}
            label1={props.label1}
            amount1={props.amount1}
            percentage1={props.percentage1}
            label2={props.label2}
            amount2={props.amount2}
            percentage2={props.percentage2}
            label3={props.label3}
            amount3={props.amount3}
            percentage3={props.percentage3}
        />
    );
}

function Vote(props) {
    const { infoVoting, infoUser } = props;
    const [isOperationModalVisible, setIsOperationModalVisible] =
        useState(false);
    const [txHash, setTxHash] = useState('');
    const [operationStatus, setOperationStatus] = useState('sign');
    const [modalTitle, setModalTitle] = useState('Voting Proposal');
    const [votingInFavorOrAgainstError, setVotingInFavorOrAgainstError] =
        useState(false);
    const [voteInFavor, setVoteInFavor] = useState(true);
    const [showProposalModal, setShowProposalModal] = useState(false);

    const [votingFinish, setVotingFinish] = useState(false);
    const [votingFinishReason, setVotingFinishReason] = useState(0);

    const {t, i18n, ns} = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const space = '\u00A0';

    useEffect(() => {
        onValidateVotingInFavorOrAgainst();
    }, [infoUser['Voting_Power']]);

    useEffect(() => {
        refreshVotingFinish();
    }, [
        infoVoting['votingData']['expired'],
        infoVoting['votingData']['totalVoted'],
        infoVoting['votingData']['againstVotesPCT']
    ]);

    const refreshVotingFinish = () => {
        /* Voting Finish Reason */
        /* 0 - No reason */
        /* 1 - Success */
        /* 2 - No Quorum */
        /* 3 - Proposal rejected by votes against */

        if (infoVoting['votingData']['expired']) {
            setVotingFinish(true);
            setVotingInFavorOrAgainstError(true);
            if (
                infoVoting['votingData']['totalVoted'].lt(
                    infoVoting['MIN_FOR_QUORUM']
                )
            ) {
                setVotingFinishReason(2);
            } else if (
                infoVoting['votingData']['againstVotesPCT'].gte(
                    infoVoting['votingData']['VOTE_MIN_TO_VETO']
                )
            ) {
                setVotingFinishReason(3);
            } else {
                setVotingFinishReason(1);
            }
        }
    };

    const votingGraphs = [
        {
            id: 1,
            description: t('voting.statusGraph.castOverCirculation'),
            percentage: `${infoVoting['votingData']['totalVotedPCT']}%`,
            needed: `${new BigNumber(infoVoting['MIN_PCT_FOR_QUORUM'])}%`,
            type: 'brand',
            label1: 'Votes casted',
            amount1: infoVoting['votingData']['totalVoted'],
            percentage1: infoVoting['votingData']['totalVotedPCT'],
            label2: 'Votes needed for Quroum',
            amount2: infoVoting['MIN_FOR_QUORUM'],
            percentage2: new BigNumber(infoVoting['MIN_PCT_FOR_QUORUM']),
            label3: 'Total circulating tokens',
            amount3: infoVoting['totalSupply'],
            percentage3: new BigNumber(100)
        },
        {
            id: 2,
            description: t('voting.statusGraph.negativeOverCirculation'),
            percentage: `${infoVoting['votingData']['againstVotesTotalSupplyPCT']}%`,
            needed: `${new BigNumber(infoVoting['VOTE_MIN_PCT_TO_VETO'])}%`,
            type: 'negative',
            label1: 'Votes Against',
            amount1: infoVoting['votingData']['againstVotes'],
            percentage1: infoVoting['votingData']['againstVotesTotalSupplyPCT'],
            label2: 'Votes needed to reject proposal',
            amount2: infoVoting['VOTE_MIN_TO_VETO'],
            percentage2: new BigNumber(infoVoting['VOTE_MIN_PCT_TO_VETO'])
        },
        {
            id: 3,
            description: t('voting.statusGraph.positiveOverCirculation'),
            percentage: `${infoVoting['votingData']['inFavorVotesTotalSupplyPCT']}%`,
            needed: `0%`,
            type: 'positive',
            label1: 'Votes in favor',
            amount1: infoVoting['votingData']['inFavorVotes'],
            percentage1: infoVoting['votingData']['inFavorVotesTotalSupplyPCT']
        }
    ];

    const onVote = async (inFavor) => {
        setModalTitle('Vote proposal');
        setVoteInFavor(inFavor);
        setShowProposalModal(true);

        setOperationStatus('sign');
        setIsOperationModalVisible(true);

        const onTransaction = (txHash) => {
            console.log('Sent transaction in Favor proposal...: ', txHash);
            setTxHash(txHash);
            setOperationStatus('pending');
        };
        const onReceipt = (/*receipt*/) => {
            console.log('Transaction in Favor proposal mined!...');
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
            console.log('Transaction in Favor proposal error!...:', error);
            setOperationStatus('error');
        };

        await auth
            .interfaceVotingVote(inFavor, onTransaction, onReceipt, onError)
            .then((/*res*/) => {
                // Refresh status
                auth.loadContractsStatusAndUserBalance().then((/*value*/) => {
                    console.log('Refresh user balance OK!');
                });
            })
            .catch((e) => {
                console.error(e);
                setOperationStatus('error');
            });
    };

    const onRunVoteStep = async () => {
        setModalTitle('Vote Step');
        setShowProposalModal(false);

        setOperationStatus('sign');
        setIsOperationModalVisible(true);

        const onTransaction = (txHash) => {
            console.log('Sent transaction vote step ...: ', txHash);
            setTxHash(txHash);
            setOperationStatus('pending');
        };
        const onReceipt = (/*receipt*/) => {
            console.log('Transaction vote step mined!...');
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
            console.log('Transaction vote step error!...:', error);
            setOperationStatus('error');
        };

        await auth
            .interfaceVotingVoteStep(onTransaction, onReceipt, onError)
            .then((/*res*/) => {
                // Refresh status
                auth.loadContractsStatusAndUserBalance().then((/*value*/) => {
                    console.log('Refresh user balance OK!');
                });
            })
            .catch((e) => {
                console.error(e);
                setOperationStatus('error');
            });
    };

    const onRunAcceptedStep = async () => {
        setModalTitle('Accepted Step');
        setShowProposalModal(false);

        setOperationStatus('sign');
        setIsOperationModalVisible(true);

        const onTransaction = (txHash) => {
            console.log('Sent transaction accepted step ...: ', txHash);
            setTxHash(txHash);
            setOperationStatus('pending');
        };
        const onReceipt = (/*receipt*/) => {
            console.log('Transaction accepted step mined!...');
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
            console.log('Transaction accepted step error!...:', error);
            setOperationStatus('error');
        };

        await auth
            .interfaceVotingAcceptedStep(onTransaction, onReceipt, onError)
            .then((/*res*/) => {
                // Refresh status
                auth.loadContractsStatusAndUserBalance().then((/*value*/) => {
                    console.log('Refresh user balance OK!');
                });
            })
            .catch((e) => {
                console.error(e);
                setOperationStatus('error');
            });
    };

    const onValidateVotingInFavorOrAgainst = () => {
        if (infoUser['Voting_Power'].lte(new BigNumber(0))) {
            // You need at least voting power > 0
            setVotingInFavorOrAgainstError(true);
            return false;
        } else return true;
    };

    return (
        <Fragment>
            {/* STATUS */}
            <div className="votingStatus">
                <div className="votingStatus__round">
                    <div className="votingStatus__title">
                        {t('voting.status.title')}
                    </div>
                </div>

                {votingFinish && (
                    <div className="voting-finish">
                        {t('voting.status.finished')}
                    </div>
                )}

                {!votingFinish && (
                    <div className="voting-in-progress">
                        {t('voting.status.ongoing')}
                    </div>
                )}

                {votingFinishReason === 1 && (
                    <div className="voting-status">
                        {t('voting.status.approved')}
                    </div>
                )}

                {votingFinishReason === 2 && (
                    <div className="voting-status">
                        {t('voting.status.noQuorum')}
                    </div>
                )}

                {votingFinishReason === 3 && (
                    <div className="voting-status">
                        {t('voting.status.rejected')}
                    </div>
                )}
            </div>
            <div className="votingDetails__wrapper">
                <div className={'layout-card-title'}>
                    <h1>{t('voting.cardTitle.votingStage')}</h1>
                </div>

                <div className="details">
                    <div className="title">
                        {infoVoting.votingData['winnerProposal']}
                    </div>
                    {/* <div className="change-contract">
                        {infoVoting.votingData['winnerProposal']}
                    </div> */}
                    {/* 
                    {votingFinish && (
                        <div className="voting-finish">
                            The voting period is over!
                        </div>
                    )}

                    {!votingFinish && (
                        <div className="voting-in-progress">
                            The voting is in progress!
                        </div>
                    )}

                    {votingFinishReason === 1 && (
                        <div className="voting-status">
                            Proposal was approved!
                        </div>
                    )}

                    {votingFinishReason === 2 && (
                        <div className="voting-status">
                            No reach quorum for this proposal!
                        </div>
                    )}

                    {votingFinishReason === 3 && (
                        <div className="voting-status">
                            Proposal was rejected by votes against!
                        </div>
                    )} */}

                    <div className="externalLink">
                        <a
                            className="forumLink"
                            href={`https://forum.moneyonchain.com/search?q=${infoVoting.votingData['winnerProposal']}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t('voting.info.searchForum')}
                            <div className="icon-external-link"></div>
                        </a>
                    </div>

                    <div className="externalLink">
                        <a
                            className="forumLink"
                            href={`https://rootstock.blockscout.com/address/${infoVoting.votingData['winnerProposal']}?tab=contract`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t('voting.info.changeContract')}
                            <span className="icon-external-link"></span>
                        </a>
                    </div>
                </div>
                <div className="voting__status__container">
                    <div className="graphs">
                        <p className="voting__status">
                            {t('voting.info.stateAs')}
                            <span>
                                {
                                    infoVoting['votingData'][
                                        'votingExpirationTimeFormat'
                                    ]
                                }
                            </span>
                        </p>
                        <BalanceBar
                            key="1"
                            infavor={`${infoVoting['votingData']['inFavorVotesPCT'].toFormat(2, BigNumber.ROUND_UP, { decimalSeparator: '.', groupSeparator: ',' })}%`}
                            against={`${infoVoting['votingData']['againstVotesPCT'].toFormat(2, BigNumber.ROUND_UP, { decimalSeparator: '.', groupSeparator: ',' })}%`}
                            infavorVotes={
                                infoVoting['votingData']['inFavorVotes']
                            }
                            againstVotes={
                                infoVoting['votingData']['againstVotes']
                            }
                        />
                        <div className="voting__status__graphs">
                            {votingGraphs.map(CreateBarGraph)}
                        </div>
                    </div>
                    <div className="cta">
                        <div className="cta-container">
                            {infoVoting['readyToVoteStep'] === 0 && (
                                <>
                                    <div className="cta-info-group">
                                        <div className="cta-info-summary">
                                            {t('voting.userPower.votingPower')}
                                            {space}
                                            {PrecisionNumbers({
                                                amount: infoUser[
                                                    'Voting_Power'
                                                ],
                                                token: TokenSettings('TG'),
                                                decimals: 2,
                                                i18n: i18n,
                                                skipContractConvert: true
                                            })}
                                            {t('staking.tokens.TG.abbr', {
                                                ns: ns
                                            })}
                                            {space} {space}(
                                            {PrecisionNumbers({
                                                amount: infoUser[
                                                    'Voting_Power_PCT'
                                                ],
                                                token: TokenSettings('TG'),
                                                decimals: 4,
                                                i18n: i18n,
                                                skipContractConvert: true
                                            })}
                                            %)
                                        </div>
                                    </div>
                                    <div className="cta-options-group votingButtons">
                                        <button
                                            className="button against"
                                            onClick={() => onVote(false)}
                                            disabled={
                                                votingInFavorOrAgainstError
                                            }
                                        >
                                            <div className="icon icon__vote__against"></div>
                                            {t('voting.votingOptions.against')}
                                        </button>
                                        <button
                                            className="button infavor"
                                            onClick={() => onVote(true)}
                                            disabled={
                                                votingInFavorOrAgainstError
                                            }
                                        >
                                            <div className="icon icon__vote__infavor"></div>
                                            {t('voting.votingOptions.inFavor')}
                                        </button>
                                    </div>
                                </>
                            )}
                            {infoVoting['readyToVoteStep'] === 1 &&
                                infoVoting['state'] !== 2 && (
                                    <>
                                        <div className="cta-info-group center">
                                            <div className="cta-info-detail">
                                                {t('voting.cta.infoAdvance')}
                                            </div>
                                            <div className="cta-info-summary "></div>
                                            <div className="cta-options-group">
                                                <button
                                                    className="button secondary"
                                                    onClick={onRunVoteStep}
                                                >
                                                    {t(
                                                        'voting.cta.btnPushNextStep'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            {infoVoting['state'] === 2 && (
                                <div className="final-step-section">
                                    <div className="vote-info">
                                        {t('voting.cta.infoApplyChanges')}
                                    </div>
                                    <button
                                        className="button secondary"
                                        onClick={onRunAcceptedStep}
                                    >
                                        {t(
                                            'voting.cta.btnApplyChangesToContracts'
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isOperationModalVisible && (
                    <VotingStatusModal
                        title={modalTitle}
                        visible={isOperationModalVisible}
                        onCancel={() => setIsOperationModalVisible(false)}
                        operationStatus={operationStatus}
                        txHash={txHash}
                        proposalChanger={
                            infoVoting.votingData['winnerProposal']
                        }
                        votingInFavor={voteInFavor}
                        showProposal={showProposalModal}
                    />
                )}
            </div>
        </Fragment>
    );
}

export default Vote;
