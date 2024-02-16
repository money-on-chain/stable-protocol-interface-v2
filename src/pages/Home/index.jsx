import React, { Fragment } from 'react';

import ListOperations from '../../components/Tables/ListOperations';

import '../../assets/css/pages.scss';
import StakingRewards from '../../components/Dashboards/StakingRewards';
import Portfolio from '../../components/Dashboards/Portfolio';

function Home(props) {
    return (
        <Fragment>
            {/* Portfolio */}
            <Portfolio />
            <div className="content-last-operations">
                <ListOperations token={'all'}></ListOperations>
            </div>
        </Fragment>
    );
}

export default Home;
