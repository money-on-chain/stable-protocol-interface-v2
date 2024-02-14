import { Outlet } from 'react-router-dom';
import { Layout, Alert } from 'antd';
import React, { useContext } from 'react';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import SectionHeader from '../../../components/Header';
import ModalTokenMigration from '../../../components/TokenMigration/Modal';

import '../../../assets/css/global.scss';

const { Content, Footer } = Layout;

export default function Skeleton() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    return (
        <Layout>
            {!auth.isLoggedIn && (
                <Alert message="Please connect your wallet!" type="error" />
            )}

            <SectionHeader />
            <Content>
                <div className="content-container">
                    {/* Content page*/}
                    <div className="content-page">
                        <ModalTokenMigration />
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
