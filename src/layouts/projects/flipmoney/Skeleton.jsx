import { Outlet } from 'react-router-dom';
import { Alert, Button, Layout } from 'antd';
import React, { useContext } from 'react';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import SectionHeader from '../../../components/Header';
import DappFooter from '../../../components/Footer/index';
import W3ErrorAlert from '../../../components/Notification/W3ErrorAlert';

const { Content, Footer } = Layout;

export default function Skeleton() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    return (
        <Layout>
            <SectionHeader />
            <Content>
                {auth.web3Error && (
                    <W3ErrorAlert />
                    // <Alert
                    //     className="alert alert-error"
                    //     message="Web3 connection Error!"
                    //     description={
                    //         <div>
                    //             There is a problem connecting to the blockchain,
                    //             please review the internet connection.
                    //         </div>
                    //     }
                    //     type="error"
                    //     showIcon
                    //     // closable
                    // />
                )}

                {!auth.web3Error && <Outlet />}
            </Content>
            <Footer>
                <div className="footer-container">
                    <DappFooter></DappFooter>
                </div>
            </Footer>
        </Layout>
    );
}
