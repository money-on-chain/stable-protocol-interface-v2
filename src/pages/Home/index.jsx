import React, { Fragment } from "react";
import LastOperations from "../../components/Tables/LastOperations";
import Portfolio from "../../components/Dashboards/Portfolio";
import HomeTabs from "../../components/PortfolioOperationsTabs";

import "./Styles.scss";

function Home() {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    // Tabs for mobile
    const Tab1 = () => (
        <div className="dashboard-portfolio">
            <Portfolio />
        </div>
    );

    const Tab2 = () => (
        <div className="content-last-operations">
            <LastOperations token={"all"}></LastOperations>
        </div>
    );

    const tabs = [
        { name: "Portfolio", content: <Tab1 /> },
        { name: "Last Operations", content: <Tab2 /> },
    ];

    return (
        <>
            {isMobile ? (
                <div className="mobile-only">
                    <HomeTabs tabs={tabs} />
                </div>
            ) : (
                <div className="section-container desktop-only">
                    <Portfolio />
                    <div className="content-last-operations">
                        <LastOperations token={"all"}></LastOperations>
                    </div>
                </div>
            )}
        </>
    );
}

export default Home;
