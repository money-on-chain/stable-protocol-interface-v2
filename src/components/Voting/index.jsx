import React, { useContext } from 'react';
import { Alert, Button, Space } from 'antd';
import VestingSchedule from '../../components/Tables/VestingSchedule';
import settings from '../../settings/settings.json';
import { useProjectTranslation } from '../../helpers/translations';
import Proposal from './Proposal';

export default function Voting(props) {
    const [t, i18n, ns] = useProjectTranslation();

    const dummyProposals = [
        {
            id: 1,
            title: 'Proposal 1',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis lorem ut libero malesuada feugiat. Curabitur aliquet quam id dui posuere blandit. Nulla quis',
            contract: "0x1234567890123456789012345678901234567890",
            votesCast: 123,
            positiveVotes: 10,
            url: 'https://www.google.com',
        },
        {
            id: 2,
            title: 'Proposal 2',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis lorem ut libero malesuada feugiat. Curabitur aliquet quam id dui posuere blandit. Nulla quis',
            contract: "0x1234567890123456789012345678901234567890",
            votesCast: 50,
            positiveVotes: 5,
            url: 'https://www.google.com',
        }
    ];

    return (
        <div className="voting">
            <div id="vesting-onboarding" className="layout-card page1">
                {' '}
                <div className="layout-card-title">
                    <h1>{t('voting.votingGeneral.title')}</h1>
                </div>{' '}
                <div className="layout-card-title">
                    <h1>{t('voting.votingGeneral.proposals')}</h1>
                </div>{' '}
                <div className="layout-card-content">
                    {dummyProposals.map((proposal) => (
                        <Proposal key={proposal.id} proposal={proposal} className="proposal"/>
                    ))}
                </div>
            </div>
        </div>
    );
}
