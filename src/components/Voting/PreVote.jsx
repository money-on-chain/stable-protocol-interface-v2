import React, { Fragment, useContext, useState } from 'react';
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
        />
    );
}

function PreVote(props) {

    const { proposal, onBack, infoVoting, infoUser, onUnRegisterProposal } = props;
    const [t, i18n, ns] = useProjectTranslation();
    const space = '\u00A0';
    const auth = useContext(AuthenticateContext);

    const [isOperationModalVisible, setIsOperationModalVisible] =
        useState(false);
    const [txHash, setTxHash] = useState('');
    const [operationStatus, setOperationStatus] = useState('sign');
    const [modalTitle, setModalTitle] = useState('Voting in favor');

    const preVotingGraphs = [
        {
            id: 0,
            description: 'votes need to advance to next step',
            percentage: `${proposal.votesPositivePCT}%`,
            needed:  `${infoVoting.PRE_VOTE_MIN_PCT_TO_WIN}%`,
            type: 'brand'
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
                /*auth.loadContractsStatusAndUserBalance().then(
                    (value) => {
                        console.log('Refresh user balance OK!');
                    }
                );*/
            })
            .catch((e) => {
                console.error(e);
                setOperationStatus('error');
            });
    };

    return (
        <Fragment>
            <div className={'layout-card-title'}>
                <h1>Proposal</h1>
            </div>
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
                            <p>
                                {t('voting.info.stateAs')}
                                <span>{proposal.expirationTimeStampFormat} </span>
                                <span>({proposal.expired ? 'Expired' : 'Ready to vote'})</span>
                            </p>
                            <p>
                                <span>Voting round:</span> {proposal.votingRound.toString()}
                            </p>

                            <div className='voting__status__graphs'>
                                {preVotingGraphs.map(CreateBarGraph)}
                            </div>

                            <div className='voting__status__votes'>
                                {PrecisionNumbers({
                                    amount: proposal.votesPositive,
                                    token: TokenSettings('TG'),
                                    decimals: 2,
                                    t: t,
                                    i18n: i18n,
                                    ns: ns,
                                    skipContractConvert: true
                                })}
                                {' / '}
                                {PrecisionNumbers({
                                    amount: infoVoting.totalSupply,
                                    token: TokenSettings('TG'),
                                    decimals: 2,
                                    t: t,
                                    i18n: i18n,
                                    ns: ns,
                                    skipContractConvert: true
                                })}

                                {' '} Votes
                            </div>
                            <div className='voting__status__votes'>
                                Need al least {' '}

                                {PrecisionNumbers({
                                    amount: infoVoting['PRE_VOTE_MIN_TO_WIN'],
                                    token: TokenSettings('TG'),
                                    decimals: 2,
                                    t: t,
                                    i18n: i18n,
                                    ns: ns,
                                    skipContractConvert: true
                                })}

                                {' '} votes to advance to vote step
                            </div>

                            </div>
                            <div className='cta'>
                                <div className='votingButtons'>
                                    <button className='button infavor' onClick={onVoteInFavor}>
                                        <div className='icon icon__vote__infavor'></div>
                                        {t('voting.votingOptions.inFavor')}
                                    </button>
                                </div>

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
                            </div>
                        </div>
                        <div className="go-back">
                        <button className="button secondary" onClick={() => onBack()}>
                            Back to Proposals{' '}
                        </button>

                        {proposal.canUnregister && (<button className="button"
                                                            onClick={() => onUnRegisterProposal(proposal.changeContract)}>{t('Unregister Proposal')}</button>
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
