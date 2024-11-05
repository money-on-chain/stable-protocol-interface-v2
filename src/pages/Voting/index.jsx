import React, { Fragment, useEffect, useState } from 'react';
import { useContext } from 'react';
import { Alert, Button, Skeleton } from 'antd';
import 'antd/dist/antd.css';

import { AuthenticateContext } from '../../context/Auth';
import { useProjectTranslation } from '../../helpers/translations';
import Voting from '../../components/Voting';
import UseVestingAlert from '../../components/Notification/UsingVestingAlert';

import '../../assets/css/pages.scss';

function SectionVoting(props) {
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

    const truncateAddress = (address) => {
        return (
            address.substring(0, 6) +
            '...' +
            address.substring(address.length - 4, address.length)
        );
    };

    const onDisplayAccount = () => {
        auth.onShowModalAccount();
    };

    return (
        <Fragment>
            {/* <div className="section-container"> */}
            <div className="section-container">
                {usingVestingAddress !== '' && (
                    <div className={'content-page'}>
                        {<UseVestingAlert address={usingVestingAddress} />}
                    </div>
                )}
                {ready ? <Voting /> : <Skeleton active />}
            </div>
            {/* </div> */}
        </Fragment>
    );
}

export default SectionVoting;
