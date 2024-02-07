import React, { Fragment, useEffect, useState } from 'react';
import { useContext } from 'react';
import { Row, Alert } from 'antd';

import { AuthenticateContext } from '../../context/Auth';
import ListOperations from '../../components/Tables/ListOperations';
import { useProjectTranslation } from '../../helpers/translations';

import '../../assets/css/pages.scss';
import StakingRewards from '../../components/Dashboards/StakingRewards';
import Portfolio from '../../components/Dashboards/Portfolio';

function Home(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    return (
        <Fragment>

            {/* Dashboard Staking Rewards  
            TODO to hide while developing the backend information*/}
            <StakingRewards />
            {/* Portfolio */}
            <Portfolio />

            <div className="content-last-operations">
                <ListOperations token={'all'}></ListOperations>
            </div>
        </Fragment>
    );
}

export default Home;
