import React, { useContext, useEffect, useState } from 'react';
import { useProjectTranslation } from '../../helpers/translations';
import CompletedBar from './CompletedBar';
import BalanceBar from './BalanceBar';
import { AuthenticateContext } from '../../context/Auth';
import VotingStatusModal from '../Modals/VotingStatusModal/VotingStatusModal';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { TokenSettings } from '../../helpers/currencies';
import BigNumber from 'bignumber.js';

function CreateBarGraph(props) {
    return (
        <CompletedBar
            key={props.id}
            description={props.description}
            percentage={props.percentage}
            needed={props.needed}
            type={props.type}
            labelCurrent={props.labelCurrent}
            labelNeedIt={props.labelNeedIt}
            labelTotal={props.labelTotal}
            valueCurrent={props.valueCurrent}
            valueNeedIt={props.valueNeedIt}
            valueTotal={props.valueTotal}
            pctCurrent={props.pctCurrent}
            pctNeedIt={props.pctNeedIt}
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
    const [votingInFavorOrAgainstError, setVotingInFavorOrAgainstError] = useState(false);
    const [voteInFavor, setVoteInFavor] = useState(true);
    const [showProposalModal, setShowProposalModal] = useState(false);

    const [votingFinish, setVotingFinish] = useState(false);
    const [votingFinishReason, setVotingFinishReason] = useState(0);

    const [t, i18n, ns] = useProjectTranslation();
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
            if (infoVoting['votingData']['totalVoted'].lt(infoVoting['MIN_FOR_QUORUM'])) {
                setVotingFinishReason(2)
            } else if (infoVoting['votingData']['againstVotesPCT'].gte(infoVoting['votingData']['VOTE_MIN_TO_VETO'])) {
                setVotingFinishReason(3)
            } else {
                setVotingFinishReason(1)
            }
        }
    }

    const votingGraphs = [
        {
            id: 1,
            description: t('voting.statusGraph.castOverCirculation'),
            percentage: `${infoVoting['votingData']['totalVotedPCT']}%`,
            needed: `${new BigNumber(infoVoting['MIN_PCT_FOR_QUORUM'])}%`,
            type: 'brand',
            labelCurrent: 'Votes',
            labelNeedIt: 'Quorum',
            labelTotal: 'Total circulating tokens',
            valueCurrent: infoVoting['votingData']['totalVoted'],
            valueNeedIt: infoVoting['MIN_FOR_QUORUM'],
            valueTotal: infoVoting['totalSupply'],
            pctCurrent: infoVoting['votingData']['totalVotedPCT'],
            pctNeedIt: new BigNumber(infoVoting['MIN_PCT_FOR_QUORUM'])
        },
        {
            id: 2,
            description: t('voting.statusGraph.negativeOverCirculation'),
            percentage: `${infoVoting['votingData']['againstVotesTotalSupplyPCT']}%`,
            needed: `${new BigNumber(infoVoting['VOTE_MIN_PCT_TO_VETO'])}%`,
            type: 'negative',
            labelCurrent: 'Votes against',
            labelNeedIt: 'Reject proposal',
            //labelTotal: 'Total circulating tokens',
            valueCurrent: infoVoting['votingData']['againstVotes'],
            valueNeedIt: infoVoting['VOTE_MIN_TO_VETO'],
            //valueTotal: infoVoting['totalSupply'],
            pctCurrent: infoVoting['votingData']['againstVotesTotalSupplyPCT'],
            pctNeedIt: new BigNumber(infoVoting['VOTE_MIN_PCT_TO_VETO'])
        },
        {
            id: 3,
            description: t('voting.statusGraph.positiveOverCirculation'),
            percentage: `${infoVoting['votingData']['inFavorVotesTotalSupplyPCT']}%`,
            needed: `0%`,
            type: 'positive',
            labelCurrent: 'Votes positives',
            //labelTotal: 'Total circulating tokens',
            valueCurrent: infoVoting['votingData']['inFavorVotes'],
            //valueTotal: infoVoting['totalSupply'],
            pctCurrent: infoVoting['votingData']['inFavorVotesTotalSupplyPCT'],
        },
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
        const onReceipt = (receipt) => {
            console.log('Transaction in Favor proposal mined!...');
            setOperationStatus('success');
            const filteredEvents = auth.interfaceDecodeEvents(receipt);
        };
        const onError = (error) => {
            console.log('Transaction in Favor proposal error!...:', error);
            setOperationStatus('error');
        };

        await auth
            .interfaceVotingVote(
                inFavor,
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

    const onRunVoteStep= async () => {
        setModalTitle('Vote Step');
        setShowProposalModal(false);

        setOperationStatus('sign');
        setIsOperationModalVisible(true);

        const onTransaction = (txHash) => {
            console.log('Sent transaction vote step ...: ', txHash);
            setTxHash(txHash);
            setOperationStatus('pending');
        };
        const onReceipt = (receipt) => {
            console.log('Transaction vote step mined!...');
            setOperationStatus('success');
            const filteredEvents = auth.interfaceDecodeEvents(receipt);
        };
        const onError = (error) => {
            console.log('Transaction vote step error!...:', error);
            setOperationStatus('error');
        };

        await auth
            .interfaceVotingVoteStep(
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

    const onRunAcceptedStep= async () => {
        setModalTitle('Accepted Step');
        setShowProposalModal(false);

        setOperationStatus('sign');
        setIsOperationModalVisible(true);

        const onTransaction = (txHash) => {
            console.log('Sent transaction accepted step ...: ', txHash);
            setTxHash(txHash);
            setOperationStatus('pending');
        };
        const onReceipt = (receipt) => {
            console.log('Transaction accepted step mined!...');
            setOperationStatus('success');
            const filteredEvents = auth.interfaceDecodeEvents(receipt);
        };
        const onError = (error) => {
            console.log('Transaction accepted step error!...:', error);
            setOperationStatus('error');
        };

        await auth
            .interfaceVotingAcceptedStep(
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

    const onValidateVotingInFavorOrAgainst = () => {
        if (infoUser['Voting_Power'].lte(new BigNumber(0))) {
            // You need at least voting power > 0
            setVotingInFavorOrAgainstError(true);
            return false;
        } else return true;
    };

    return (
        <div className="votingDetails__wrapper">
            <div className={'layout-card-title'}>
                <h1>{t('voting.cardTitle')}</h1>
            </div>

            <div className='details'>
                <div className='title'>Proposal change contract</div>
                <div className='change-contract'>{infoVoting.votingData['winnerProposal']}</div>

                {votingFinish && (
                    <div className='voting-finish'>The voting period is over!</div>
                )}

                {!votingFinish && (
                    <div className='voting-in-progress'>The voting is in progress!</div>
                )}

                {votingFinishReason === 1 && (
                    <div className='voting-status'>Proposal was approved!</div>
                )}

                {votingFinishReason === 2 && (
                    <div className='voting-status'>No reach quorum for this proposal!</div>
                )}

                {votingFinishReason === 3 && (
                    <div className='voting-status'>Proposal was rejected by votes against!</div>
                )}

                <div className='externalLink'>
                    <a
                        className='forumLink'
                        href={`https://forum.moneyonchain.com/search?q=${infoVoting.votingData['winnerProposal']}`}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        {t('voting.info.searchForum')}
                        <div className='icon-external-link'></div>
                    </a>
                </div>

                <div className='externalLink'>
                    <a
                        className='forumLink'
                        href={`https://rootstock.blockscout.com/address/${infoVoting.votingData['winnerProposal']}?tab=contract`}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        {t('voting.info.changeContract')}
                        <span className='icon-external-link'></span>
                    </a>
                </div>
            </div>
            <div className='voting__status__container'>
            <div className="graphs">
                    <p className="voting__status">
                        {t('voting.info.stateAs')}
                        <span>{infoVoting['votingData']['votingExpirationTimeFormat']} </span>
                    </p>
                    <BalanceBar
                        key="1"
                        infavor={`${infoVoting['votingData']['inFavorVotesPCT'].toFormat(2, BigNumber.ROUND_UP, {decimalSeparator: '.', groupSeparator: ','})}%`}
                        against={`${infoVoting['votingData']['againstVotesPCT'].toFormat(2, BigNumber.ROUND_UP, {decimalSeparator: '.', groupSeparator: ','})}%`}
                        infavorVotes={infoVoting['votingData']['inFavorVotes']}
                        againstVotes={infoVoting['votingData']['againstVotes']}
                    />
                    <div className="voting__status__graphs">
                        {votingGraphs.map(CreateBarGraph)}
                    </div>
                </div>
                <div className="cta">
                    {infoVoting['readyToVoteStep'] === 0 && (
                        <div className="voting-buttons-section">
                            <div className="votingButtons">
                                <button className="button against" onClick={() => onVote(false)} disabled={votingInFavorOrAgainstError}>
                                    <div className="icon icon__vote__against"></div>
                                    {t('voting.votingOptions.against')}
                                </button>
                                <button className="button infavor" onClick={() => onVote(true)} disabled={votingInFavorOrAgainstError}>
                                    <div className="icon icon__vote__infavor"></div>
                                    {t('voting.votingOptions.inFavor')}
                                </button>
                            </div>
                            <div className="voting__status__votingInfo">
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

                                    {' '}

                                    {t('staking.tokens.TG.abbr', {
                                        ns: ns
                                    })}

                                    {' '}
                                    ({PrecisionNumbers({
                                    amount: infoUser['Voting_Power_PCT'],
                                    token: TokenSettings('TG'),
                                    decimals: 4,
                                    t: t,
                                    i18n: i18n,
                                    ns: ns,
                                    skipContractConvert: true
                                })}
                                    %)
                                </div>
                            </div>
                        </div>
                    )}

                    {infoVoting['readyToVoteStep'] === 1 && infoVoting['state'] !== 2 && (
                        <div className="step-buttons-section">
                            <div className="vote-info">
                                Please run Step to advance to next stage
                            </div>
                            <button className="button secondary" onClick={onRunVoteStep}>
                                Run Step{' '}
                            </button>
                        </div>
                    )}

                    {infoVoting['state'] === 2 && (
                        <div className="final-step-section">
                            <div className="vote-info">
                                Please run "accepted step" to finish & apply the changes to contracts
                            </div>
                            <button className="button secondary" onClick={onRunAcceptedStep}>
                                Accepted Step{' '}
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {isOperationModalVisible && (
                <VotingStatusModal
                    title={modalTitle}
                    visible={isOperationModalVisible}
                    onCancel={() => setIsOperationModalVisible(false)}
                    operationStatus={operationStatus}
                    txHash={txHash}
                    proposalChanger={infoVoting.votingData['winnerProposal']}
                    votingInFavor={voteInFavor}
                    showProposal={showProposalModal}
                />
            )}

        </div>
    );
}

export default Vote;
