import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Col, Row, Skeleton, Alert } from 'antd';
import { useProjectTranslation } from '../../helpers/translations';
import { pendingWithdrawalsFormat } from '../../helpers/staking';
import BigNumber from 'bignumber.js';
import Stake from './Stake';
import PieChartComponent from './PieChart';
import PerformanceChart from '../PerformanceChart';
import Withdraw from './Withdraw';
import { AuthenticateContext } from '../../context/Auth';

const withdrawalStatus = {
    pending: 'PENDING',
    available: 'AVAILABLE'
};

export default function Staking(props) {
    const auth = useContext(AuthenticateContext);
    const [t] = useProjectTranslation();
    const [activeTab, setActiveTab] = useState('tab1');
    const [tgBalance, setTgBalance] = useState('0');
    const [lockedBalance, setLockedBalance] = useState('0');
    const [stakedBalance, setStakedBalance] = useState('0');
    const [pendingWithdrawals, setPendingWithdrawals] = useState(null);
    const [totalPendingExpiration, setTotalPendingExpiration] = useState('0');
    const [totalAvailableToWithdraw, setTotalAvailableToWithdraw] = useState('0');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth.accountData && auth.userBalanceData) {
            setLoading(false);
            setStakingBalances();
        }
    }, [auth]);

    const setStakingBalances = async () => {
        //try {
        let [_stakedBalance, _lockedBalance, _pendingWithdrawals] = ['0', '0', []];
        if (auth.userBalanceData) {
            if (auth.isVestingLoaded()) {
                setTgBalance(auth.userBalanceData.vestingmachine.tgBalance);
                _stakedBalance = auth.userBalanceData.vestingmachine.staking.balance;
                _lockedBalance = auth.userBalanceData.vestingmachine.staking.getLockedBalance;
                _pendingWithdrawals = pendingWithdrawalsFormat(auth.userBalanceData.vestingmachine.delay);
            } else {
                setTgBalance(auth.userBalanceData.TG.balance);
                _stakedBalance = auth.userBalanceData.stakingmachine.getBalance;
                _lockedBalance = auth.userBalanceData.stakingmachine.getLockedBalance;
                _pendingWithdrawals = pendingWithdrawalsFormat(auth.userBalanceData.delaymachine);
            }
        }
        const pendingWithdrawalsFormatted = _pendingWithdrawals
            .filter((withdrawal) => withdrawal.expiration)
            .map((withdrawal) => {
                const status = new Date(parseInt(withdrawal.expiration) * 1000) > new Date() ? withdrawalStatus.pending : withdrawalStatus.available;

                return {
                    ...withdrawal,
                    status
                };
            });
        let pendingExpirationAmount = '0';
        let readyToWithdrawAmount = '0';
        pendingWithdrawalsFormatted.forEach(({ status, amount }) => {
            if (status === withdrawalStatus.pending) {
                pendingExpirationAmount = BigNumber.sum(pendingExpirationAmount, amount).toFixed(0);
            } else {
                readyToWithdrawAmount = BigNumber.sum(readyToWithdrawAmount, amount).toFixed(0);
            }
        });
        const arrayDes = pendingWithdrawalsFormatted.sort(function (a, b) {
            return b.id.toString() - a.id.toString();
        });
        setLockedBalance(_lockedBalance);
        setStakedBalance(_stakedBalance);
        setTotalPendingExpiration(pendingExpirationAmount);
        setTotalAvailableToWithdraw(readyToWithdrawAmount);
        setPendingWithdrawals(arrayDes);
        //} catch (error) {
        //console.log('Error getting staking balances', error);
        //}
    };

    return (
        <div className="cards-container">
            <div className="Staking">
                {!loading && (
                    <Fragment>
                        <Row gutter={24} className="row-section">
                            <Col span={10}>
                                <div className="layout-card">
                                    <div className="layout-card-title">
                                        <h1>{t('staking.cardTitle')}</h1>
                                    </div>
                                    <div className="tabs">
                                        <button onClick={() => setActiveTab('tab1')} className={`tab-button ${activeTab === 'tab1' ? 'active' : ''}`}>
                                            {t('staking.staking.tabStake')}
                                        </button>
                                        <button onClick={() => setActiveTab('tab2')} className={`tab-button ${activeTab === 'tab2' ? 'active' : ''}`}>
                                            {t('staking.staking.tabUnstake')}
                                        </button>
                                    </div>
                                    <div className="tab-divider"></div>
                                    {/* Tab Content */}
                                    <div className="tab-content">
                                        <Stake
                                            activeTab={activeTab}
                                            tgBalance={tgBalance}
                                            stakedBalance={stakedBalance}
                                            lockedBalance={lockedBalance}
                                            setStakingBalances={setStakingBalances}
                                            totalAvailableToWithdraw={totalAvailableToWithdraw}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col span={7}>
                                <div className="layout-card staking-distribution-card">
                                    <div className="layout-card-title">
                                        <h1>{t('staking.distribution.title')}</h1>
                                    </div>
                                    <div className="tab-content">
                                        <PieChartComponent
                                            tgBalance={tgBalance}
                                            stakedBalance={stakedBalance}
                                            totalPendingExpiration={totalPendingExpiration}
                                            totalAvailableToWithdraw={totalAvailableToWithdraw}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col span={7}>
                                <div className="layout-card">
                                    <div className="layout-card-title">
                                        <h1>{t('staking.performance.title')}</h1>
                                    </div>
                                    <div className="tab-content">
                                        <PerformanceChart />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={24} className="row-section">
                            <Col span={24}>
                                <Withdraw
                                    totalPendingExpiration={totalPendingExpiration}
                                    totalAvailableToWithdraw={totalAvailableToWithdraw}
                                    pendingWithdrawals={pendingWithdrawals}
                                />
                            </Col>
                        </Row>
                    </Fragment>
                )}
            </div>
        </div>
    );
}
