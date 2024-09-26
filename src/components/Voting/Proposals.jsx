import React from 'react';
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

function Proposals(proposalData) {
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
        }
    ];

    return (
        <div className="proposal__wrapper">
            <div className="title">{proposalData.changeContract}</div>
            <div className="proposal__content">
                <div className="details">
                    <div className="externalLink">
                        <a
                            className="forumLink"
                            href={`https://forum.moneyonchain.com/search?q=${proposalData.changeContract}`}
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
                            href={`https://rootstock.blockscout.com/address/${proposalData.changeContract}?tab=contract`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t('voting.info.changeContract')}
                            <span className="icon-external-link"></span>
                        </a>
                    </div>

                    <p>
                        {t('voting.info.stateAs')}
                        <span>12/14/2020, 05:28:04 PM </span>
                    </p>

                    <div className="votingStatus__graphs">
                        {preVotingGraphs.map(CreateBarGraph)}
                    </div>
                </div>
                <div className="cta">
                    <button className="button">{t('View Proposal')}</button>
                </div>
            </div>
        </div>
    );
}

export default Proposals;
