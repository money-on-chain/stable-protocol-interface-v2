import React, { Fragment, useState, useEffect } from 'react';
import { useContext } from 'react';
import { Alert, Button, Skeleton } from 'antd';
import 'antd/dist/antd.css';

import { AuthenticateContext } from '../../context/Auth';
import Staking from '../../components/Staking';
import { useProjectTranslation } from '../../helpers/translations';
import UseVestingAlert from '../../components/Notification/UsingVestingAlert';

import '../../assets/css/pages.scss';

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
            <div className="section-container">
                {/* <div className="content-page"> */}
                <div className="sectionStaking">
                    {usingVestingAddress !== '' && (
                        // <div className={'section-layout'}>
                        //     <Alert
                        //         className="alert alert-info"
                        //         message={t('vesting.alert.title')}
                        //         description={
                        //             t('vesting.alert.explanation') +
                        //             '. Vesting: ' +
                        //             truncateAddress(usingVestingAddress)
                        //         }
                        //         type="error"
                        //         showIcon
                        //         // closable
                        //         action={
                        //             <Button
                        //                 size="small"
                        //                 type="custom"
                        //                 onClick={onDisplayAccount}
                        //             >
                        //                 {t('vesting.alert.cta')}
                        //             </Button>
                        //         }
                        //     />
                        // </div>
                        <UseVestingAlert address={usingVestingAddress} />
                    )}
                    {ready ? <Staking /> : <Skeleton active />}
                </div>
                {/* </div> */}
            </div>
        </Fragment>
    );
}

export default SectionStaking;
