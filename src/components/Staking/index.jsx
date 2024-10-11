import React, { Fragment, useState, useEffect, useContext } from 'react';
import { useProjectTranslation } from '../../helpers/translations';
import { pendingWithdrawalsFormat } from '../../helpers/staking';
import BigNumber from 'bignumber.js';
import Stake from './Stake';
import PieChartComponent from './PieChart';
import PerformanceChart from './performanceChart';
import Withdraw from './Withdraw';
import DashBoard from './DashBoard';
import { AuthenticateContext } from '../../context/Auth';
import Web3 from 'web3';

const withdrawalStatus = {
    pending: 'PENDING',
    available: 'AVAILABLE'
};

export default function Staking(props) {
    const auth = useContext(AuthenticateContext);
    const [t] = useProjectTranslation();
    const [activeTab, setActiveTab] = useState('tab1');

    const defaultUserInfoStaking = {
        'tgBalance': new BigNumber(0),
        'stakedBalance': new BigNumber(0),
        'lockedBalance': new BigNumber(0),
        'pendingWithdrawals': [],
        'totalPendingExpiration': new BigNumber(0),
        'totalAvailableToWithdraw': new BigNumber(0),
        'lockedInVoting': new BigNumber(0),
    }
    const [userInfoStaking, setUserInfoStaking] = useState(defaultUserInfoStaking);

    useEffect(() => {
        if (auth.accountData && auth.userBalanceData) {
            refreshBalances();
        }
    }, [auth]);


    const refreshBalances = () => {

        const nowTimestamp = new BigNumber(Date.now())
        let pendingWithdrawals = []
        let vUsing;
        if (auth.isVestingLoaded()) {
            userInfoStaking['tgBalance'] = auth.userBalanceData.vestingmachine.tgBalance
            userInfoStaking['stakedBalance'] = auth.userBalanceData.vestingmachine.staking.balance
            userInfoStaking['lockedBalance'] = auth.userBalanceData.vestingmachine.staking.getLockedBalance
            pendingWithdrawals = pendingWithdrawalsFormat(auth.userBalanceData.vestingmachine.delay)
            vUsing = auth.userBalanceData.vestingmachine.staking;

        } else {
            userInfoStaking['tgBalance'] = auth.userBalanceData.TG.balance
            userInfoStaking['stakedBalance'] = auth.userBalanceData.stakingmachine.getBalance
            userInfoStaking['lockedBalance'] = auth.userBalanceData.stakingmachine.getLockedBalance
            pendingWithdrawals = pendingWithdrawalsFormat(auth.userBalanceData.delaymachine)
            vUsing = auth.userBalanceData.stakingmachine;
        }

        const lockedAmount = new BigNumber(
            Web3.utils.fromWei(vUsing.getLockingInfo.amount, 'ether')
        );
        const lockedUntilTimestamp = new BigNumber(
            vUsing.getLockingInfo.untilTimestamp
        ).times(1000)

        if (lockedUntilTimestamp.gt(nowTimestamp)) {
            userInfoStaking['lockedInVoting'] = lockedAmount
        } else {
            userInfoStaking['lockedInVoting'] = new BigNumber(0)
        }

        const pendingWithdrawalsFormatted = pendingWithdrawals
            .filter((withdrawal) => withdrawal.expiration)
            .map((withdrawal) => {
                const status =
                    new Date(parseInt(withdrawal.expiration) * 1000) >
                    new Date()
                        ? withdrawalStatus.pending
                        : withdrawalStatus.available;

                return {
                    ...withdrawal,
                    status
                };
            });
        let pendingExpirationAmount = new BigNumber(0);
        let readyToWithdrawAmount = new BigNumber(0);
        pendingWithdrawalsFormatted.forEach(({ status, amount }) => {
            if (status === withdrawalStatus.pending) {
                pendingExpirationAmount = BigNumber.sum(
                    pendingExpirationAmount,
                    amount
                );
            } else {
                readyToWithdrawAmount = BigNumber.sum(
                    readyToWithdrawAmount,
                    amount
                );
            }
        });
        const pendingWithdrawalsSort = pendingWithdrawalsFormatted.sort(function(a, b) {
            return b.id.toString() - a.id.toString();
        });

        userInfoStaking['pendingWithdrawals'] = pendingWithdrawalsSort
        userInfoStaking['totalPendingExpiration'] = pendingExpirationAmount
        userInfoStaking['totalAvailableToWithdraw'] = readyToWithdrawAmount

        setUserInfoStaking(userInfoStaking)
    };

    return (
        <div>
            <div className={'section-layout'}>
                <DashBoard userInfoStaking={userInfoStaking} />
            </div>

            <div className={'section-layout'}>
                <div className="cards-container sectionStaking">
                    <Fragment>
                        <div className="section row-section">
                            {' '}
                            <div className="firstCardsGroup">
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
                                            <h1>
                                                {t('staking.distribution.title')}
                                            </h1>
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
                            <div>
                                <Withdraw
                                    userInfoStaking={userInfoStaking}
                                />
                            </div>
                        </div>
                    </Fragment>
                </div>
            </div>
        </div>
        );
        }
