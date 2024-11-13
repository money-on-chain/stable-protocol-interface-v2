import React, { Fragment, useState, useEffect } from 'react';
import { useContext } from 'react';
import { Skeleton } from 'antd';

import { AuthenticateContext } from '../../context/Auth';
import { useProjectTranslation } from '../../helpers/translations';
import UseVestingAlert from '../../components/Notification/UsingVestingAlert';
import LiquidityMiningClaim from '../../components/LiquidityMiningClaim';
import './Styles.scss';

function SectionLiquidityMining(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    const [usingVestingAddress, setUsingVestingAddress] = useState('');
    useEffect(() => {
        if (auth.contractStatusData) {
            setReady(true);
        }
        if (auth.userBalanceData && auth.isVestingLoaded()) {
            setUsingVestingAddress(auth.vestingAddress());
        } else {
            setUsingVestingAddress('');
        }
    }, [auth]);

    return (
        <Fragment>
            <div className="section-container">
                <div className="sectionClaim">
                    {usingVestingAddress !== '' && (
                        <UseVestingAlert address={usingVestingAddress} />
                    )}
                    {ready ? <LiquidityMiningClaim /> : <Skeleton active />}
                </div>
            </div>
        </Fragment>
    );
}

export default SectionLiquidityMining;
