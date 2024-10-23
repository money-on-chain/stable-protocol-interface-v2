import React, { Fragment, useEffect, useState, useContext } from 'react';
import ListOperations from '../../components/Tables/ListOperations';
import ListOperationsMobile from '../../components/Tables/ListOperationsMobile';
import { AuthenticateContext } from '../../context/Auth';
import '../../assets/css/pages.scss';
import Portfolio from '../../components/Dashboards/Portfolio';
import HomeTabs from '../../components/PortfolioOperationsTabs';



function Home(props) {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (auth.contractStatusData) {
            setReady(true);
        }
    }, [auth]);

    // Tabs for mobile
    const Tab1 = () => (
        <div className="dashboard-portfolio">
            <Portfolio />
        </div>
    );

    const Tab2 = () => (
        <div className="content-last-operations">
            <ListOperationsMobile token={'all'}></ListOperationsMobile>
        </div>
    );

    const tabs = [
        { name: 'Portfolio', content: <Tab1 /> },
        { name: 'Last Operations', content: <Tab2 /> }
    ];

    return (
        <>
            {isMobile ? (
                <div className="mobile-only">
                    <HomeTabs tabs={tabs} />
                </div>
            ) : (
                <div className="section-container desktop-only">
                    <div className="content-page">
                        <Portfolio />
                        <div className="content-last-operations">
                            <ListOperationsMobile
                                token={'all'}
                            ></ListOperationsMobile>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Home;
