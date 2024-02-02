import React, { Fragment, useEffect, useState } from 'react';
import { useContext } from 'react';
import { Row, Alert } from 'antd';
import { AuthenticateContext } from '../../context/Auth';
import ListOperations from '../../components/Tables/ListOperations';
import { useProjectTranslation } from '../../helpers/translations';

import '../../assets/css/pages.scss';
import StakingRewards from '../../components/Dashboards/StakingRewards';
import Portfolio from '../../components/Dashboards/Portfolio';
import NotificationTab from '../../components/Notification/NotificationTab';

function Home(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    return (
        <Fragment>

            {/* Dashboard Staking Rewards  
            TODO to hide while developing the backend information*/}
            <StakingRewards />
            {/* Notification panel*/}
            {process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase() === 'roc' && <NotificationTab
                msg={"RIF Dollar (RDOC) has changed to RIF US Dollar (USDRIF). You need to swap your RIF Dollars to operate with the updated DAPP. You won't be able to see your RDOC balance in the DAPP. Please, swap your tokens using the Swap Now button."}
                detailedMsg={"RIF Dollar (RDOC) has changed to RIF US DOLLAR (USDRIF). You need to swap your RIF Dollars to operate with the updated DAPP. You won't be able to see your RDOC balance in the DAPP. The exchange rate for the swap is 1RDOC =1USDRIF. You only need to pay for the network gas. Clicking Confirm button your wallet will ask you to sign the transaction. All your RDOC balance will be converted to USDRIF."}
            />}
            {/* Portfolio */}
            <Portfolio />

            <div className="content-last-operations">
                <ListOperations token={'all'}></ListOperations>
            </div>
        </Fragment>
    );
}

export default Home;
