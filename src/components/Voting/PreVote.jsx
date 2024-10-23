import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useProjectTranslation } from '../../helpers/translations';
import CompletedBar from './CompletedBar';
import { PrecisionNumbers } from '../PrecisionNumbers';
import BigNumber from 'bignumber.js';
import { TokenSettings } from '../../helpers/currencies';
import { AuthenticateContext } from '../../context/Auth';
import VotingStatusModal from '../Modals/VotingStatusModal/VotingStatusModal';

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

function PreVote(props) {
    const {
        proposal,
        onBack,
        infoVoting,
        infoUser,
        onUnRegisterProposal,
        onRunPreVoteStep
    } = props;
    const [t, i18n, ns] = useProjectTranslation();
    const space = '\u00A0';
    const auth = useContext(AuthenticateContext);

    const [isOperationModalVisible, setIsOperationModalVisible] =
        useState(false);
    const [txHash, setTxHash] = useState('');
    const [operationStatus, setOperationStatus] = useState('sign');
    const [modalTitle, setModalTitle] = useState('Voting in favor');
    const [votingInFavorError, setVotingInFavorError] = useState(false);
    const [showProposalModal, setShowProposalModal] = useState(false);

    useEffect(() => {
        onValidateVotingInFavor();
    }, [infoUser['Voting_Power'], proposal['canVote']]);

    const onValidateVotingInFavor = () => {
        if (infoUser['Voting_Power'].lte(new BigNumber(0))) {
            // You need at least voting power > 0
            setVotingInFavorError(true);
            return false;
        }
        if (!proposal['canVote']) {
            setVotingInFavorError(true);
            return false;
        }

        return true;
    };

    const preVotingGraphs = [
        {
            id: 0,
            description: 'votes need to advance to next step',
            percentage: `${proposal.votesPositivePCT}%`,
            needed: `${infoVoting.PRE_VOTE_MIN_PCT_TO_WIN}%`,
            type: 'brand',
            labelCurrent: 'Votes',
            labelNeedIt: 'Quorum',
            labelTotal: 'Total circulating tokens',
            valueCurrent: proposal.votesPositive,
            valueNeedIt: infoVoting['PRE_VOTE_MIN_TO_WIN'],
            valueTotal: infoVoting['totalSupply'],
            pctCurrent: proposal.votesPositivePCT,
            pctNeedIt: new BigNumber(infoVoting['PRE_VOTE_MIN_PCT_TO_WIN']),

            label1: 'Votes received',
            amount1: proposal.votesPositive,
            percentage1: proposal.votesPositivePCT,
            label2: 'Votes needed for Quroum',
            amount2: infoVoting['PRE_VOTE_MIN_TO_WIN'],
            percentage2: new BigNumber(infoVoting['PRE_VOTE_MIN_PCT_TO_WIN']),
            label3: 'Total circulating tokens',
            amount3: infoVoting['totalSupply'],
            percentage3: new BigNumber(100)
        }
    ];

    const onVoteInFavor = async (e) => {
        setModalTitle(`Voting proposal`);
        setShowProposalModal(true);

        setOperationStatus('sign');
        setIsOperationModalVisible(true);

        const onTransaction = (txHash) => {
            console.log(
                'Sent transaction voting in favor proposal...: ',
                txHash
            );
            setTxHash(txHash);
            setOperationStatus('pending');
        };
        const onReceipt = (receipt) => {
            console.log('Transaction voting in favor proposal mined!...');
            setOperationStatus('success');
            const filteredEvents = auth.interfaceDecodeEvents(receipt);
        };
        const onError = (error) => {
            console.log(
                'Transaction voting in favor proposal error!...:',
                error
            );
            setOperationStatus('error');
        };

        await auth
            .interfaceVotingPreVote(
                proposal.changeContract,
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

    return (
        <Fragment>
            {/* STATUS */}
            <div className="votingStatus">
                <div className="votingStatus__round">
                    <div className="votingStatus__title">
                        {t('voting.status.title')}
                    </div>
                </div>
                {!proposal.canVote && (
                    <div className="proposal-period">
                        {t('voting.status.firstStageClosed')}
                    </div>
                )}

                {proposal.canVote && (
                    <div className="proposal-period">
                        {t('voting.status.firstStageActive')}
                    </div>
                )}
            </div>
            <div className="proposal__wrapper">
                <div className={'title'}>
                    <h1>{t('voting.cardTitle.proposalDetails')}</h1>
                </div>
                <div className="title">{proposal.changeContract}</div>
                <div className="proposal__content">
                    <div className="details">
                        <div className="externalLink">
                            <a
                                className="forumLink"
                                href={`https://forum.moneyonchain.com/search?q=${proposal.changeContract}`}
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
                                href={`https://rootstock.blockscout.com/address/${proposal.changeContract}?tab=contract`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t('voting.info.changeContract')} {space}
                                {proposal.changeContract}
                                <span className="icon-external-link"></span>
                            </a>
                        </div>
                        <p>
                            {t('voting.info.stateAs')}
                            <span>{proposal.expirationTimeStampFormat}</span>
                        </p>
                        {/* <div className="voting__status__container"> */}
                        <div className="graphs">
                            {/* {!proposal.canVote && (
                                    <div className="proposal-period">
                                        Voting is closed—either the time has
                                        expired or a proposal has already won.
                                    </div>
                                )}

                                {proposal.canVote && (
                                    <div className="proposal-period">
                                        First-stage voting is active—cast your
                                        vote now!
                                    </div>
                                )} */}

                            <div className="voting__status__graphs">
                                {preVotingGraphs.map(CreateBarGraph)}
                            </div>
                        </div>
                    </div>
                    <div className="cta">
                        <div className="cta-container">
                            <div className="cta-info-group center">
                                <div className="cta-info-detail">
                                    {proposal.canVote && (
                                        <div className="votingPowerContainer">
                                            <div className="votingPowerLabel"></div>
                                            {/* 
                                                <div className="voting__status__votingInfo">
                                                    <div className="votingInfo__item"> */}
                                            {/* <div className="label"> */}
                                            {t('voting.userPower.votingPower')}
                                            {/* </div> */}
                                            <div className="votingPowerData">
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
                                                {t('staking.tokens.TG.abbr', {
                                                    ns: ns
                                                })}
                                                (
                                                {PrecisionNumbers({
                                                    amount: infoUser[
                                                        'Voting_Power_PCT'
                                                    ],
                                                    token: TokenSettings('TG'),
                                                    decimals: 2,
                                                    t: t,
                                                    i18n: i18n,
                                                    ns: ns,
                                                    skipContractConvert: true
                                                })}
                                                %)
                                            </div>
                                        </div>
                                        //     </div>
                                        // </div>
                                    )}
                                    <div className="cta-info-summary "> </div>
                                </div>
                                <div className="cta-options-group votingButtons">
                                    {proposal.canVote && (
                                        <button
                                            className="button infavor"
                                            onClick={onVoteInFavor}
                                            disabled={votingInFavorError}
                                        >
                                            <div className="icon icon__vote__infavor"></div>
                                            {t('voting.votingOptions.inFavor')}
                                        </button>
                                    )}
                                    {proposal.canRunStep && (
                                        <button
                                            className="button secondary"
                                            onClick={() => onRunPreVoteStep()}
                                        >
                                            Push to Next Step
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* </div> */}
                    </div>
                </div>
                <div className="go-back">
                    <button className="button" onClick={() => onBack()}>
                        Back to Proposals
                    </button>

                    {proposal.canUnregister && (
                        <button
                            className="button"
                            onClick={() =>
                                onUnRegisterProposal(proposal.changeContract)
                            }
                        >
                            Unregister Proposal
                        </button>
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
                    proposalChanger={proposal.changeContract}
                    votingInFavor={true}
                    showProposal={showProposalModal}
                />
            )}
        </Fragment>
    );
}

export default PreVote;
