import React, { Fragment, useState, useEffect } from 'react';
import { useContext } from 'react';
import { Skeleton } from 'antd';
import { AuthenticateContext } from '../../context/Auth';
import ListOperations from '../../components/Tables/ListOperations';
import { useProjectTranslation } from '../../helpers/translations';

import '../../assets/css/pages.scss';
import StakingRewards from '../../components/Dashboards/StakingRewards';
import Exchange from '../../components/Exchange';

function SectionExchange(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (auth.contractStatusData && auth.userBalanceData) {
            setReady(true);
        }
    }, [auth]);

    return (
        <Fragment>
            {/* Dashboard Staking Rewards */}
            {/* <StakingRewards /> */}

            {/* Exchange */}
            <div className={'dashboard-exchange layout-card-title'}>
                <div className={'title'}>
                    <h1>{t('exchange.cardTitle')}</h1>
                </div>

                <div className={'content-body'}>{ready ? <Exchange /> : <Skeleton active />}</div>
            </div>

            <div className="content-last-operations">
                <ListOperations token={'all'} />
            </div>
        </Fragment>
    );
}

export default SectionExchange;
