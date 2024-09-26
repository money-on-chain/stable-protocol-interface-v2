import React, { Fragment, useEffect, useState } from 'react';
// import React, { Fragment } from 'react';
import { useContext } from 'react';
import { Skeleton } from 'antd';

import { AuthenticateContext } from '../../context/Auth';
import { useProjectTranslation } from '../../helpers/translations';

import Proposals from '../../components/Voting/Proposals';
import PreVote from '../../components/Voting/PreVote';
import Vote from '../../components/Voting/Vote';

import '../../assets/css/pages.scss';
console.log('Hey');

function SectionVoting(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (auth.contractStatusData) {
            setReady(true);
        }
    }, [auth]);

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
        <Fragment>
            <div className="section-container">
                <div className="content-page">
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
                </div>
            </div>
        </Fragment>
    );
}

export default SectionVoting;
