import React, { Fragment } from 'react';
import { useContext } from 'react';

import { AuthenticateContext } from '../../context/Auth';
import { useProjectTranslation } from '../../helpers/translations';
import ListOperations from '../../components/Tables/ListOperations';

import Performance from '../../components/Performance';

import StakingRewards from '../../components/Dashboards/StakingRewards';
import '../../assets/css/pages.scss';

function SectionPerformance(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    return (
        <Fragment>
            <div className={'content-performance'}>
                <Performance></Performance>
            </div>
        </Fragment>
    );
}

export default SectionPerformance;
