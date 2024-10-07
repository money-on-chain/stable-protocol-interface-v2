import { useProjectTranslation } from '../../helpers/translations';
import React from 'react';
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

function Proposal(props) {

    const { proposal, onViewProposal, infoVoting } = props;
    const [t, i18n, ns] = useProjectTranslation();
    const space = '\u00A0';

    const preVotingGraphs = [
        {
            id: 0,
            description: 'votes need to advance to next step',
            percentage: `${proposal.votesPositivePCT}%`,
            needed:  `${infoVoting.PRE_VOTE_MIN_PCT_TO_WIN}%`,
            type: 'brand'
        }
    ];

    return (
        <div className="proposal__wrapper">
            <div className="title">{proposal.changeContract}</div>
            <div className="proposal__content">
                <div className='details'>
                    <div className='externalLink'>
                        <a
                            className='forumLink'
                            href={`https://forum.moneyonchain.com/search?q=${proposal.changeContract}`}
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
                            href={`https://rootstock.blockscout.com/address/${proposal.changeContract}?tab=contract`}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            {t('voting.info.changeContract')}
                            <span className='icon-external-link'></span>
                        </a>
                    </div>

                    <p>
                        {t('voting.info.stateAs')}
                        <span>{proposal.expirationTimeStampFormat} </span>
                        <span>({proposal.expired ? 'Expired' : 'Ready to vote'})</span>
                    </p>

                    <p>
                        <span>Voting round:</span> {proposal.votingRound.toString()}
                    </p>

                    <div className='votingStatus__graphs'>
                        {preVotingGraphs.map(CreateBarGraph)}
                    </div>
                </div>
                <div className='cta'>
                    <button className='button'
                            onClick={() => onViewProposal(proposal.changeContract)}>{t('View Proposal')}</button>
                </div>
            </div>
        </div>
    );
}

export default Proposal;
