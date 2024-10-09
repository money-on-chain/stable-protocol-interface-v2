import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useProjectTranslation } from '../../helpers/translations';
import CompletedBar from './CompletedBar';
import { PrecisionNumbers } from '../PrecisionNumbers';
import BigNumber from 'bignumber.js';
import { TokenSettings } from '../../helpers/currencies';
import { AuthenticateContext } from '../../context/Auth';
import Web3 from 'web3';
import OperationStatusModal from '../Modals/OperationStatusModal/OperationStatusModal';

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

function PreVote(props) {

    const {
        proposal,
        onBack,
        infoVoting,
        infoUser,
        onUnRegisterProposal,
        onRunPreVoteStep } = props;
    const [t, i18n, ns] = useProjectTranslation();
    const space = '\u00A0';
    const auth = useContext(AuthenticateContext);

    const [isOperationModalVisible, setIsOperationModalVisible] =
        useState(false);
    const [txHash, setTxHash] = useState('');
    const [operationStatus, setOperationStatus] = useState('sign');
    const [modalTitle, setModalTitle] = useState('Voting in favor');

    const [votingInFavorError, setVotingInFavorError] = useState(false);

    useEffect(() => {
        onValidateVotingInFavor();
    }, [auth]);


    const preVotingGraphs = [
        {
            id: 0,
            description: 'votes need to advance to next step',
            percentage: `${proposal.votesPositivePCT}%`,
            needed:  `${infoVoting.PRE_VOTE_MIN_PCT_TO_WIN}%`,
            type: 'brand',
            labelCurrent: 'Votes',
            labelNeedIt: 'Quorum',
            labelTotal: 'Total circulating tokens',
            valueCurrent: proposal.votesPositive,
            valueNeedIt: infoVoting['PRE_VOTE_MIN_TO_WIN'],
            valueTotal: infoVoting['totalSupply'],
            pctCurrent: proposal.votesPositivePCT,
            pctNeedIt: new BigNumber(infoVoting['PRE_VOTE_MIN_PCT_TO_WIN'])
        },

    ];

    const onVoteInFavor= async (e) => {
        setModalTitle(`Voting in Favor proposal ${proposal.changeContract}`);

        setOperationStatus('sign');
        setIsOperationModalVisible(true);

        const onTransaction = (txHash) => {
            console.log('Sent transaction voting in favor proposal...: ', txHash);
            setTxHash(txHash);
            setOperationStatus('pending');
        };
        const onReceipt = (receipt) => {
            console.log('Transaction voting in favor proposal mined!...');
            setOperationStatus('success');
            const filteredEvents = auth.interfaceDecodeEvents(receipt);
        };
        const onError = (error) => {
            console.log('Transaction voting in favor proposal error!...:', error);
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

    const onValidateVotingInFavor = () => {
        if (infoUser['Voting_Power'].lte(new BigNumber(0))) {
            // You need at least voting power > 0
            setVotingInFavorError(true);
            return false;
        } else return true;
    };

    return (
        <Fragment>
            <div className="votingDetails__wrapper">
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

                    <div className="voting__status__container">

                        <div className='graphs'>

                            {proposal.canRunStep && (
                                <div className='proposal-period'>The first stage voting period is over!</div>
                            )}

                            {!proposal.canRunStep && (
                                <div className='proposal-period'>The first stage voting is in progress!</div>
                            )}

                            <p>
                                {t('voting.info.stateAs')}
                                <span>{proposal.expirationTimeStampFormat} </span>
                            </p>

                            <div className='voting__status__graphs'>
                                {preVotingGraphs.map(CreateBarGraph)}
                            </div>

                        </div>
                            <div className='cta'>
                                <div className='votingButtons'>
                                    {!proposal.canRunStep && (
                                        <button className='button infavor' onClick={onVoteInFavor} disabled={votingInFavorError}>
                                            <div className='icon icon__vote__infavor'></div>
                                            {t('voting.votingOptions.inFavor')}
                                        </button>
                                    )}
                                    {proposal.canRunStep && (
                                        <button className="button"
                                                onClick={() => onRunPreVoteStep()}>
                                            Next step
                                        </button>
                                    )}
                                </div>

                                {!proposal.canRunStep && (
                                    <div className='voting__status__votingInfo'>
                                        <div className='votingInfo__item'>
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
                                                decimals: 2,
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
                            </div>
                        </div>
                        <div className="go-back">
                            <button className="button secondary" onClick={() => onBack()}>
                                Back to Proposals{' '}
                            </button>

                            {proposal.canUnregister && (
                                <button className="button"
                                    onClick={() => onUnRegisterProposal(proposal.changeContract)}>
                                    Unregister Proposal
                                </button>
                            )}
                        </div>
                </div>
            </div>

            {isOperationModalVisible && (
                <OperationStatusModal
                    title={modalTitle}
                    visible={isOperationModalVisible}
                    onCancel={() => setIsOperationModalVisible(false)}
                    operationStatus={operationStatus}
                    txHash={txHash}
                />
            )}

        </Fragment>
    );
}

export default PreVote;
