import React, { Fragment } from 'react';
import { useContext } from 'react';

import { AuthenticateContext } from '../../context/Auth';
import { useProjectTranslation } from '../../helpers/translations';
import Performance from '../../components/Performance';

import '../../assets/css/pages.scss';
import StakingRewards from '../../components/Dashboards/StakingRewards';


function SectionPerformance(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    return (
        <Fragment>

            {/* Dashboard Staking Rewards */}
            <StakingRewards />

            <div className={'content-performance'}>

                <Performance></Performance>

            </div>

        </Fragment>
    );
}

export default SectionPerformance;
