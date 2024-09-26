import React from 'react';
import { useProjectTranslation } from '../../helpers/translations';
import CompletedBar from './CompletedBar';
import BalanceBar from './BalanceBar';

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

function Vote(votingData) {
    const [t, i18n, ns] = useProjectTranslation();
    const space = '\u00A0';

    const votingGraphs = [
        {
            id: 1,
            description: t('voting.statusGraph.castOverCirculation'),
            percentage: '15%',
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

    return (
        <div className="votingDetails__wrapper">
            <div className={'layout-card-title'}>
                <h1>{t('voting.cardTitle')}</h1>
            </div>
            <div className="details">
                <div className="externalLink">
                    <a
                        className="forumLink"
                        href={`https://forum.moneyonchain.com/search?q=${votingData.changeContract}`}
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
                        href={`https://rootstock.blockscout.com/address/${votingData.changeContract}?tab=contract`}
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
                        <span>12/14/2020, 05:28:04 PM </span>
                    </p>
                    <BalanceBar key="1" infavor="90%" against="10%" />
                    <div className="voting__status__graphs">
                        {votingGraphs.map(CreateBarGraph)}
                    </div>
                </div>
                <div className="cta">
                    <div className="votingButtons">
                        <button className="button against">
                            <div className="icon icon__vote__against"></div>
                            {t('voting.votingOptions.against')}
                        </button>
                        <button className="button infavor">
                            <div className="icon icon__vote__infavor"></div>
                            {t('voting.votingOptions.inFavor')}
                        </button>
                    </div>
                    <div className="voting__status__votedInfo">
                        <div className="votingInfo__item">
                            <div className="label">You already voted with </div>
                            <div className="data">
                                5.0 tokens (5000000000000000000 wei)
                            </div>
                        </div>
                    </div>
                    <div className="voting__status__votingInfo">
                        <div className="votingInfo__item">
                            <div className="label">
                                {t('voting.userPower.votingPower')}
                            </div>
                            <div className="data">
                                5.0 tokens (5000000000000000000 wei)
                            </div>
                        </div>
                        <div className="votingInfo__item">
                            <div className="label">
                                {t('voting.userPower.totalMOC')}
                            </div>
                            <div className="data">
                                480.0 tokens (480000000000000000000 wei)
                            </div>
                        </div>
                        <div className="votingInfo__item">
                            <div className="label">
                                {t('voting.userPower.totalSupply')}
                            </div>
                            <div className="data">1.041666 %</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Vote;
