import React, { Fragment, useContext, useEffect, useState } from 'react';

import { useProjectTranslation } from '../../helpers/translations';
import { AuthenticateContext } from '../../context/Auth';
import './Styles.scss';
import { BarGraph, BarBalance } from './VotingGraph';

export default function Voting(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

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

    function CreateBarGraph(props) {
        return (
            <BarGraph
                key={props.id}
                description={props.description}
                percentage={props.percentage}
                needed={props.needed}
                type={props.type}
            />
        );
    }

    return (
        <div className="section voting">
            <div className="data__container">
                <div className="current-state">
                    {t('voting.states.stateTitle')} {space}
                    {t('voting.states.voting')}
                </div>
                <div className="voting__status__state">
                    <div>
                        {t('voting.info.changeContract')}
                        {space}
                        <a
                            href="https://rootstock.blockscout.com/address/0xAC346b1C8E0204D8f8612856b472343c5eeA3793?tab=contract"
                            target="_blank"
                        >
                            0xAC346b1C8E0204D8f8612856b472343c5eeA3793
                        </a>
                    </div>
                    <div>
                        <a
                            href="https://forum.moneyonchain.com/search?q=0xAC346b1C8E0204D8f8612856b472343c5eeA3793"
                            target="_blank"
                        >
                            {t('voting.info.searchForum')}
                        </a>
                    </div>
                    <div>
                        {t('voting.info.stateAs')}
                        <span>12/14/2020, 05:28:04 PM </span>
                    </div>
                </div>
            </div>
            <div className="voting__status__container">
                <BarBalance key="1" infavor="90%" against="10%" />
                <div className="voting__status__votingOptions">
                    <div className="voting__status__votingButtons">
                        <button className="button against">
                            <div className="icon icon__vote__against"></div>
                            {t('voting.votingOptions.against')}
                        </button>
                        <button className="button infavor">
                            <div className="icon icon__vote__infavor"></div>
                            {t('voting.votingOptions.inFavor')}
                        </button>
                    </div>
                </div>
            </div>
            <div className="voting__status__dashboard">
                <div className="voting__status__graphs">
                    {votingGraphs.map(CreateBarGraph)}
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
    );
}
