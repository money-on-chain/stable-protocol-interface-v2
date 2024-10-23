import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import SectionHeader from '../../../components/Header';
import ModalTokenMigration from '../../../components/TokenMigration/Modal';

// import '../../../assets/css/global.scss';

import NotificationBody from '../../../components/Notification';
import CheckStatus from '../../../helpers/checkStatus';
import DappFooter from '../../../components/Footer/index';

const { Content, Footer } = Layout;

export default function Skeleton() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [notifStatus, setNotifStatus] = useState(null);
    const [canSwap, setCanSwap] = useState(false);
    const { checkerStatus } = CheckStatus();
    useEffect(() => {
        if (auth.contractStatusData && auth.userBalanceData) {
            readProtocolStatus();
        }
    }, [auth.contractStatusData, auth.userBalanceData]);

    const readProtocolStatus = () => {
        const { isValid, statusIcon, statusLabel, statusText } =
            checkerStatus();
        if (!isValid) {
            console.log('is not valid');
            setNotifStatus({
                id: -1,
                title: `Warning, protocol status is ${statusLabel}`,
                textContent: statusText,
                notifClass: 'warning',
                iconLeft: statusIcon,
                isDismisable: false,
                dismissTime: 0
            });
        } else {
            setNotifStatus(null);
        }
        const tpLegacyBalance = new BigNumber(
            Web3.utils.fromWei(auth.userBalanceData.tpLegacy.balance, 'ether')
        );
        if (tpLegacyBalance.gt(0)) {
            setCanSwap(true);
        } else {
            setCanSwap(false);
        }
    };

    return (
        <Layout>
            <SectionHeader />
            <Content>
                <div className="section-container">
                    {/* Content page*/}
                    <div className="content-page">
                        {canSwap && <ModalTokenMigration />}
                        {/* TODO load an array of notifStatus items, and load a mapping for showing notifs here in this section , interact with a React Context */}
                        {notifStatus && (
                            <NotificationBody notifStatus={notifStatus} />
                        )}
                        <Outlet />
                    </div>
                </div>
            </Content>
            <Footer>
                <div className="footer-container">
                    <DappFooter></DappFooter>
                </div>
            </Footer>
        </Layout>
    );
}
