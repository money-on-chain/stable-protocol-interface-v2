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
import LastStakeOperations from '../../components/Staking/LastStakeOperations';

const withdrawalStatus = {
    pending: 'PENDING',
    available: 'AVAILABLE'
};

const defaultTokenStake = tokenStake()[0];
const tokenSettingsStake = TokenSettings(defaultTokenStake);

const formatBigNumber = (amount) => {
    return new BigNumber(fromContractPrecisionDecimals(amount, tokenSettingsStake.decimals));
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

        const cData = { ...userInfoStaking };
        const nowTimestamp = new BigNumber(Date.now())
        let pendingWithdrawals = []
        let vUsing;
        if (auth.isVestingLoaded()) {
            cData['tgBalance'] = formatBigNumber(auth.userBalanceData.vestingmachine.tgBalance)
            cData['stakedBalance'] = formatBigNumber(auth.userBalanceData.vestingmachine.staking.balance)
            cData['lockedBalance'] = formatBigNumber(auth.userBalanceData.vestingmachine.staking.getLockedBalance)
            pendingWithdrawals = pendingWithdrawalsFormat(auth.userBalanceData.vestingmachine.delay)
            vUsing = auth.userBalanceData.vestingmachine.staking;

        } else {
            cData['tgBalance'] = formatBigNumber(auth.userBalanceData.TG.balance)
            cData['stakedBalance'] = formatBigNumber(auth.userBalanceData.stakingmachine.getBalance)
            cData['lockedBalance'] = formatBigNumber(auth.userBalanceData.stakingmachine.getLockedBalance)
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
            cData['lockedInVoting'] = lockedAmount
        } else {
            cData['lockedInVoting'] = new BigNumber(0)
        }

        cData['unstakeBalance'] = cData['stakedBalance'].minus(cData['lockedInVoting'])

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
                    formatBigNumber(amount)
                );
            } else {
                readyToWithdrawAmount = BigNumber.sum(
                    readyToWithdrawAmount,
                    formatBigNumber(amount)
                );
            }
        });
        const pendingWithdrawalsSort = pendingWithdrawalsFormatted.sort(function(a, b) {
            return b.id.toString() - a.id.toString();
        });

        cData['pendingWithdrawals'] = pendingWithdrawalsSort
        cData['totalPendingExpiration'] = pendingExpirationAmount
        cData['totalAvailableToWithdraw'] = readyToWithdrawAmount

        setUserInfoStaking(cData)
    };

    return (
        <div>
            <div className={'section-layout'}>
                <DashBoard userInfoStaking={userInfoStaking} />
            </div>
            <div className="cards-container sectionStaking">
                <Fragment>
                    <div className="section row-section">
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
                        <div className="SecondCardsGroup">
                            <div>
                                <Withdraw
                                    userInfoStaking={userInfoStaking}
                                />
                            </div>
                            <div
                                id="lastStakingOperations"
                                className="section__innerCard"
                            >
                                <LastStakeOperations
                                    userInfoStaking={userInfoStaking}
                                />
                            </div>
                        </div>
                    </div>
                </Fragment>
            </div>
        </div>
    );
}
