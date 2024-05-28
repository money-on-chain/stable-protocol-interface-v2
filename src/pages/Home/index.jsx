import React, { Fragment, useEffect, useState, useContext } from 'react';
import { Skeleton } from 'antd';
import ListOperations from '../../components/Tables/ListOperations';
import { AuthenticateContext } from '../../context/Auth';
import '../../assets/css/pages.scss';
import StakingRewards from '../../components/Dashboards/StakingRewards';
import Portfolio from '../../components/Dashboards/Portfolio';
import Footer from '../../components/Footer/index';
import DappFooter from '../../components/Footer/index';


function Home(props) {
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (auth.contractStatusData) {
          setReady(true);
        }
      }, [auth])
    return (
        <Fragment>
            {/* Portfolio */}
            {ready ? <Portfolio /> : <Skeleton active />}

            <div className="content-last-operations">
                <ListOperations token={'all'}></ListOperations>
            </div>
        </Fragment>   
        
    );
}

export default Home;
