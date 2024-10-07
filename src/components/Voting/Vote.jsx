import React, { useContext, useState } from 'react';
import { useProjectTranslation } from '../../helpers/translations';
import CompletedBar from './CompletedBar';
import BalanceBar from './BalanceBar';
import { AuthenticateContext } from '../../context/Auth';
import OperationStatusModal from '../Modals/OperationStatusModal/OperationStatusModal';
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

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const space = '\u00A0';

    const votingGraphs = [
        {
            id: 1,
            description: t('voting.statusGraph.castOverCirculation'),
            percentage: '20%',
            needed: '50%',
            type: 'brand'
        },
        {
            id: 2,
            description: t('voting.statusGraph.votingPower'),
            percentage: '60%',
            type: 'brand'
        },
        {
            id: 3,
            description: t('voting.statusGraph.positiveOverCirculation'),
            percentage: '53%',
            needed: '75%',
            type: 'positive'
        },
        {
            id: 4,
            description: t('voting.statusGraph.negativeOverCirculation'),
            percentage: '37%',
            needed: '72%',
            type: 'negative'
        }
    ];

    const onVote = async (inFavor) => {
        setModalTitle(`Voting in Favor proposal ${infoVoting.votingData['winnerProposal']}`);

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

    return (
        <div className="votingDetails__wrapper">
            <div className={'layout-card-title'}>
                <h1>{t('voting.cardTitle')}</h1>
            </div>

            {infoVoting['readyToVoteStep'] === 1 && (
                <div className="vote-step">
                    <div className="vote-info">Please run Step to advance to accepted stage</div>
                    <button className="button secondary" onClick={onRunVoteStep}>
                        Run Step{' '}
                    </button>
                </div>
            )}

            {infoVoting['state'] === 2 && (
                <div className="vote-step">
                    <div className="vote-info">Please run "accepted step" to finish & apply the changes to contracts</div>
                    <button className="button secondary" onClick={onRunAcceptedStep}>
                        Accepted Step{' '}
                    </button>
                </div>
            )}

            <div className="details">
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

                {/* 
                <div className="votingStatus__graphs">
                    {votingGraphs.map(CreateBarGraph)}
                </div> */}
            </div>
            <div className="voting__status__container">
                <div className="graphs">
                    <p className="voting__status">
                        {t('voting.info.stateAs')}
                        <span>{infoVoting['votingData']['votingExpirationTimeFormat']} </span>
                    </p>
                    <BalanceBar
                        key="1"
                        infavor={`${infoVoting['votingData']['inFavorVotesPCT']}%`}
                        against={`${infoVoting['votingData']['againstVotesPCT']}%`}
                        infavorVotes={infoVoting['votingData']['inFavorVotes']}
                        againstVotes={infoVoting['votingData']['againstVotes']}
                    />
                    <div className="voting__status__graphs">
                        {votingGraphs.map(CreateBarGraph)}
                    </div>
                </div>
                <div className="cta">
                    <div className="votingButtons">
                        <button className="button against" onClick={() => onVote(false)}>
                            <div className="icon icon__vote__against"></div>
                            {t('voting.votingOptions.against')}
                        </button>
                        <button className="button infavor" onClick={() => onVote(true)}>
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

        </div>
    );
}

export default Vote;