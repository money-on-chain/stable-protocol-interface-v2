import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import React, { useContext } from 'react';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import SectionHeader from '../../../components/Header';

import '../../../assets/css/global.scss';
import StakingRewards from '../../../components/Dashboards/StakingRewards';
import NotificationBody from '../../../components/Notification';
import CheckStatus from '../../../helpers/checkStatus';
import DappFooter from '../../../components/Footer/index';

const { Content, Footer } = Layout;

export default function Skeleton() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    return (
        <Layout>
            <SectionHeader />
            <Content>
                <div className="section-container">
                    {/* Content page*/}
                    <div className="content-page">
                        {/* Dashboard Staking Rewards
                            TODO to hide while developing the backend information
                            <StakingRewards />*/}
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
