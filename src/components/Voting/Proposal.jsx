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

    const { data, onViewProposal, onUnRegisterProposal } = props;
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
            <div className="title">{data.changeContract}</div>
            <div className="proposal__content">
                <div className="details">
                    <div className="externalLink">
                        <a
                            className="forumLink"
                            href={`https://forum.moneyonchain.com/search?q=${data.changeContract}`}
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
                            href={`https://rootstock.blockscout.com/address/${data.changeContract}?tab=contract`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t('voting.info.changeContract')}
                            <span className="icon-external-link"></span>
                        </a>
                    </div>

                    <p>
                        {t('voting.info.stateAs')}
                        <span>{data.expirationTimeStampFormat} </span>
                        <span>({data.expired ? 'Expired' : 'Ready to vote'})</span>
                    </p>

                    <div className="votingStatus__graphs">
                        {preVotingGraphs.map(CreateBarGraph)}
                    </div>
                </div>
                <div className="cta">
                    <button className="button"
                            onClick={() => onViewProposal(data.changeContract)}>{t('View Proposal')}</button>

                    {data.canUnregister && (<button className="button"
                            onClick={() => onUnRegisterProposal(data.changeContract)}>{t('Unregister Proposal')}</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Proposal;
