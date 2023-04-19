import React, { Fragment } from 'react';
import { useContext } from 'react';
import { Row, Alert } from 'antd';

import { AuthenticateContext } from '../../context/Auth';
import ListOperations from '../../components/Tables/ListOperations';
import { useProjectTranslation } from '../../helpers/translations';

import '../../assets/css/pages.scss';
import StakingRewards from '../../components/Dashboards/StakingRewards';
import Exchange from '../../components/Exchange';

function SectionExchange(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    return (
        <Fragment>

            {/* Dashboard Staking Rewards */}
            <StakingRewards />

            {/* Exchange */}
            <Exchange />

            <div className="content-last-operations">
                <ListOperations token={'all'}></ListOperations>
            </div>
        </Fragment>
    );
}

export default SectionExchange;
