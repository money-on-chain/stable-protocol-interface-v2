import React, { Fragment, useContext, useEffect, useState } from 'react';
import { AuthenticateContext } from '../../context/Auth';
import { Skeleton } from 'antd';
import Portfolio from '../../components/Dashboards/Portfolio';
import ListOperationsMobile from '../../components/Tables/ListOperationsMobile';

import './Styles.scss';

export default function HomeTabs({ props }) {
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (auth.contractStatusData) {
            setReady(true);
        }
    }, [auth]);

    // Tabs for mobile
    const tabs = [{ name: 'Portfolio' }, { name: 'Last Operations' }];

    // Active tab status control
    const [activeTab, setActiveTab] = useState(tabs[0].name);

    return (
        <>
            {/* TabBar Buttons*/}
            <div className="tab__container">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        className={
                            activeTab === tab.name
                                ? 'tab__button > tab__selected'
                                : 'tab__button'
                        }
                        onClick={() => setActiveTab(tab.name)}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Content based on selected tab */}
            <div>
                {tabs.map((tab) => (
                    <div
                        key={tab.name}
                        style={{
                            display: activeTab === tab.name ? 'block' : 'none'
                        }}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
            <div>
                {activeTab === tabs[0].name ? (
                    <div className="dashboard-portfolio">
                        <Portfolio />
                    </div>
                ) : (
                    <div className="content-last-operations">
                        <ListOperationsMobile
                            token={'all'}
                        ></ListOperationsMobile>
                    </div>
                )}
            </div>
        </>
    );
}
