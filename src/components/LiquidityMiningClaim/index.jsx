import React, { Fragment, useState, useEffect, useContext } from 'react';
import { useProjectTranslation } from '../../helpers/translations';
import { pendingWithdrawalsFormat, tokenStake } from '../../helpers/staking';
import BigNumber from 'bignumber.js';
import Stake from './Stake';
import PieChartComponent from './PieChart';
import PerformanceChart from './performanceChart';
import Withdraw from './WithdrawV2';
import DashBoard from './DashBoard';
import { AuthenticateContext } from '../../context/Auth';
import Web3 from 'web3';
import { fromContractPrecisionDecimals } from '../../helpers/Formats';
import { TokenSettings } from '../../helpers/currencies';

export default function LiquidityMiningClaim(props) {
    const auth = useContext(AuthenticateContext);
    const [t] = useProjectTranslation();

    return (
        <Fragment>
            <div className="section row-section">
                <div className="firstCardsGroup">
                    TEST LIQUIDITY MINING
                    <div id="stakingCard" className="layout-card">
                        <div className="layout-card-title">
                            <h1>{t('staking.cardTitle')}</h1>
                        </div>
                        <div className="tabs">
                            <button
                                onClick={() => setActiveTab('tab1')}
                                className={`tab-button ${activeTab === 'tab1' ? 'active' : ''}`}
                            >
                                {t('staking.staking.tabStake')}
                            </button>
                            <button
                                onClick={() => setActiveTab('tab2')}
                                className={`tab-button ${activeTab === 'tab2' ? 'active' : ''}`}
                            >
                                {t('staking.staking.tabUnstake')}
                            </button>
                        </div>
                        <div className="tab-divider"></div>
                        {/* Tab Content */}
                        <div className="tab-content">
                            <Stake
                                activeTab={activeTab}
                                userInfoStaking={userInfoStaking}
                            />
                        </div>
                    </div>
                    <div>
                        <div
                            id="distributionCard"
                            className="layout-card staking-distribution-card"
                        >
                            <div className="layout-card-title">
                                <h1>{t('staking.distribution.title')}</h1>
                            </div>
                            <div className="tab-content">
                                <PieChartComponent
                                    userInfoStaking={userInfoStaking}
                                />
                            </div>
                        </div>
                    </div>
                    <div id="performanceCard" className="layout-card">
                        <div className="layout-card-title">
                            <h1>{t('staking.performance.title')}</h1>
                        </div>
                        <div className="tab-content">
                            <PerformanceChart />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
