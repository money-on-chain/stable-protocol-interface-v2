import { Outlet } from 'react-router-dom';
import { Layout, Alert } from 'antd';
import React, { useContext } from 'react';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import SectionHeader from '../../../components/Header';
import ModalTokenMigration from '../../../components/TokenMigration/Modal';

import '../../../assets/css/global.scss';
import StakingRewards from '../../../components/Dashboards/StakingRewards';

const { Content, Footer } = Layout;

export default function Skeleton() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

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
