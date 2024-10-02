import React, { Fragment } from 'react';
import { useProjectTranslation } from '../../helpers/translations';
import CompletedBar from './CompletedBar';

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

    const { proposal, onBack } = props;
    const [t, i18n, ns] = useProjectTranslation();
    const space = '\u00A0';

    const preVotingGraphs = [
        {
            id: 0,
            description: 'votes cast over circulating',
            percentage: '15%',
            needed: '50%',
            type: 'brand'
        },
        {
            id: 1,
            description: 'votes cast over needed to next stage',
            percentage: '56%',
            needed: '80%',
            type: 'brand'
        },
        {
            id: 2,
            description:
                'positive votes over circulating to move to voting stage',
            percentage: '26%',
            needed: '80%',
            type: 'positive'
        }
    ];

    return (
        <Fragment>
            <div className={'layout-card-title'}>
                <h1>Pre Vote</h1>
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
                        <div className="graphs">
                            <p>
                                {t('voting.info.stateAs')}
                                <span>12/14/2020, 05:28:04 PM </span>
                            </p>
                            <div className="voting__status__graphs">
                                {preVotingGraphs.map(CreateBarGraph)}
                            </div>
                        </div>
                        <div className="cta">
                            <div className="votingButtons">
                                <button className="button infavor">
                                    <div className="icon icon__vote__infavor"></div>
                                    {t('voting.votingOptions.inFavor')}
                                </button>
                            </div>
                            <div className="voting__status__votedInfo">
                                <div className="votingInfo__item">
                                    <div className="label">
                                        You already voted with{' '}
                                    </div>
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
                    <div className="go-back">
                        <button className="button secondary" onClick={() => onBack()}>
                            Back to Proposals{' '}
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default PreVote;
