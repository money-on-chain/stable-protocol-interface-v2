import React, { Fragment, useState, useEffect } from 'react';
import { useContext } from 'react';
import { Skeleton } from 'antd';

import { AuthenticateContext } from '../../context/Auth';
import '../../assets/css/pages.scss';
import Staking from '../../components/Staking';
import StakingDashboard from '../../components/Dashboards/StakingDashboard';

function SectionStaking(props) {
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (auth.contractStatusData) {
            setReady(true);
        }
    }, [auth]);
    return (
        <Fragment>
            <div className="sectonStaking">
                <div className={'content-body'}>{ready ? <StakingDashboard /> : <Skeleton active />}</div>
                <div className={'content-body'}>{ready ? <Staking /> : <Skeleton active />}</div>
            </div>
        </Fragment>
    );
}

export default SectionStaking;
