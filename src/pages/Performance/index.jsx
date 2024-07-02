import React, { Fragment, useEffect, useState } from 'react';
import { useContext } from 'react';
import { Skeleton } from 'antd';

import { AuthenticateContext } from '../../context/Auth';
import { useProjectTranslation } from '../../helpers/translations';
import ListOperations from '../../components/Tables/ListOperations';

import Performance from '../../components/Performance';

import StakingRewards from '../../components/Dashboards/StakingRewards';
import '../../assets/css/pages.scss';

function SectionPerformance(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (auth.contractStatusData) {
            setReady(true);
        }
    }, [auth]);

    return (
        <Fragment>
            <div className={'content-performance layout-card-title'}>{ready ? <Performance /> : <Skeleton active />}</div>
        </Fragment>
    );
}

export default SectionPerformance;
