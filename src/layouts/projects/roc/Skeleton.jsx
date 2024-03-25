import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Alert } from 'antd';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import SectionHeader from '../../../components/Header';
import ModalTokenMigration from '../../../components/TokenMigration/Modal';

import '../../../assets/css/global.scss';
import StakingRewards from '../../../components/Dashboards/StakingRewards';
import NotificationBody from '../../../components/Notification';
import CheckStatus from '../../../helpers/checkStatus';

const { Content, Footer } = Layout;

export default function Skeleton() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [notifStatus, setNotifStatus] = useState(null);
    const { isValid, statusIcon, statusLabel, statusText } = CheckStatus();
    useEffect(() => {
        if (auth.contractStatusData) {
            readProtocolStatus();
        }
    }, [auth.contractStatusData])
    
    const readProtocolStatus = () => {
        if (!isValid) {
            console.log('is not valid');
            setNotifStatus({
                id: -1,
                title: `Warning, protocol status is ${statusLabel}`,
                textContent: statusText,
                notifClass: 'warning',
                iconLeft: statusIcon,
                isDismisable: false,
                dismissTime: 0,
            })
        }
    }

    return (
        <Layout>
            {!auth.isLoggedIn && (
                <Alert
                    message="Warning"
                    description="Please connect your wallet!."
                    type="error"
                    showIcon
                />
            )}
            {auth.contractStatusData && !auth.contractStatusData.canOperate && (
                <Alert
                    message="Warning"
                    description="One or more contracts are temporarily unavailable. Please try again later."
                    type="error"
                    showIcon
                />
            )}
            {auth.contractStatusData && auth.contractStatusData.paused && (
                <Alert
                    message="Warning"
                    description="The contract is paused. No operations allowed."
                    type="error"
                    showIcon
                />
            )}

            <SectionHeader />
            <Content>
                <div className="content-container">
                    {/* Content page*/}
                    <div className="content-page">
                        <ModalTokenMigration />
                        {/* TODO load an array of notifStatus items, and load a mapping for showing notifs here in this section , interact with a React Context */}
                        {notifStatus && <NotificationBody notifStatus={notifStatus} />}
                        {/* Dashboard Staking Rewards  
                            TODO to hide while developing the backend information
                            <StakingRewards />*/}
                        <Outlet />
                    </div>
                </div>
            </Content>
            {/* <Footer>
                <div className="footer-container"></div>
            </Footer>*/}
        </Layout>
    );
}
