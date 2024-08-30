import React, { Fragment, useEffect, useState, useContext } from 'react';
import { Skeleton } from 'antd';
import ListOperations from '../../components/Tables/ListOperations';
import ListOperationsMobile from '../../components/Tables/ListOperationsMobile';
import { AuthenticateContext } from '../../context/Auth';
import '../../assets/css/pages.scss';
import StakingRewards from '../../components/Dashboards/StakingRewards';
import Portfolio from '../../components/Dashboards/Portfolio';
import HomeTabs from '../../components/PortfolioOperationsTabs';

function Home(props) {
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (auth.contractStatusData) {
            setReady(true);
        }
    }, [auth]);
    return (
        <Fragment>
            <HomeTabs />
            {/* Portfolio */}
            {ready ? <Portfolio /> : <Skeleton active />}
            <div className="content-last-operations">
                {/* <ListOperations token={'all'}></ListOperations> */}
            </div>
            <div className="content-last-operations">
                <ListOperationsMobile token={'all'}></ListOperationsMobile>
            </div>
        </Fragment>
    );
}

export default Home;
