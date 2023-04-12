import { Outlet } from 'react-router-dom';
import { Layout, Menu, Image, Drawer, Button, Alert } from 'antd';
import React, { useContext, useState, useEffect } from 'react';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import SectionHeader from '../../../components/Header';
import StakingRewards from '../../../components/Dashboards/StakingRewards';
import Portfolio from '../../../components/Dashboards/Portfolio';

import '../../../assets/css/global.scss';

const { Content, Footer } = Layout;

export default function Skeleton() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    return (
        <Layout>
            {!auth.isLoggedIn && (
                <Alert
                    message={t('global.NoConnection_alertTitle')}
                    description={t('global.NoConnection_alertPleaseConnect')}
                    type="error"
                    showIcon
                    className="AlertNoConnection"
                />
            )}

            <SectionHeader />
            <Content>
                <div className="content-container">
                    {/* Dashboard Staking Rewards */}
                    <StakingRewards />

                    {/* Portfolio */}
                    <Portfolio />

                    {/* Content page*/}
                    <div className="content-page">
                        <Outlet />
                    </div>
                </div>
            </Content>
            <Footer>
                <div className="footer-container"></div>
            </Footer>
        </Layout>
    );
}
