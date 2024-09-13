import React, { Fragment, useState, useEffect } from 'react';
import { useContext } from 'react';
import { Alert, Button, Skeleton } from 'antd';

import { AuthenticateContext } from '../../context/Auth';
import '../../assets/css/pages.scss';
import Staking from '../../components/Staking';
import StakingDashboard from '../../components/Dashboards/StakingDashboard';
import { useProjectTranslation } from '../../helpers/translations';

function SectionStaking(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    const [usingVestingAddress, setUsingVestingAddress] = useState('');
    useEffect(() => {
        if (auth.contractStatusData) {
            setReady(true);
        }
        if (auth.userBalanceData && auth.isVestingLoaded()) {
            setUsingVestingAddress(auth.vestingAddress())
        } else {
            setUsingVestingAddress('');
        }
    }, [auth]);

    const truncateAddress = (address) => {
        return address.substring(0, 6) +  '...' +  address.substring(address.length - 4, address.length);
    }

    const onDisplayAccount = () => {
        auth.onShowModalAccount();
    }

    return (
        <Fragment>
            <div className="section-container">
                <div className="content-page">
                    <div className="sectonStaking">

                        {usingVestingAddress !== '' && (
                            <div className={'section-layout'}>
                                <Alert
                                    className="alert-permanent"
                                    message={t('vesting.alert.title')}
                                    description={t('vesting.alert.explanation') + '. Vesting: ' + truncateAddress(usingVestingAddress)}
                                    type="error"
                                    showIcon
                                    // closable
                                    action={
                                        <Button size="small" type="custom" onClick={onDisplayAccount}>
                                            {t('vesting.alert.cta')}
                                        </Button>
                                    }
                                />
                            </div>)}

                        <div className={'section-layout'}>
                            {ready ? <StakingDashboard /> : <Skeleton active />}
                        </div>
                        <div className={'section-layout'}>
                            {ready ? <Staking /> : <Skeleton active />}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default SectionStaking;
