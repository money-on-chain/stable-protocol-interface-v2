import { useProjectTranslation } from '../../helpers/translations';
import React, { useContext, useEffect, useState } from 'react';
import { AuthenticateContext } from '../../context/Auth';
import PreVote from './PreVote';
import Proposals from './Proposals';
import Vote from './Vote';

export default function Voting(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);


    const proposalsData = [
        {
            id: 0,
            changeContract: '0xAC346b1C8E0204D8f8612856b472343c5eeA3793',
            circulating: 984984,
            votesPositive: 34130,
            positivesNeeded: 0
        },
        {
            id: 1,
            changeContract: '0xAC346b1C8E0204D8f8612856b472343c5eeA3793',
            circulating: 984984,
            votesPositive: 8940,
            positivesNeeded: 0
        },
        {
            id: 2,
            changeContract: '0xAC346b1C8E0204D8f8612856b472343c5eeA3793',
            circulating: 984984,
            votesPositive: 181998,
            positivesNeeded: 0
        },
        {
            id: 3,
            changeContract: '0xAC346b1C8E0204D8f8612856b472343c5eeA3793',
            circulating: 984984,
            votesPositive: 12343,
            positivesNeeded: 0
        }
    ];

    return (
        <div className={'layout-card'}>
            {/* PREVOTE */}
            <div className="section preVoting">
                <PreVote changeContract="0xAC346b1C8E0204D8f8612856b472343c5eeA3793" />
            </div>

            {/* PREVOTING STAGE */}
            <div className={'layout-card-title'}>
                <h1>Pre Voting Proposals</h1>
            </div>
            <div className="section voting__proposals">
                {proposalsData.map(Proposals)}
            </div>

            {/* VOTING STAGE */}
            <div className="section voting">
                <Vote />
            </div>
        </div>
    )
}